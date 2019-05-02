import {
  Action,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Store
} from "redux";
import asyncDispatchMiddleware from "../middleware/asyncDispatch";
import Queue from "../offline/queue";
import lists, {
  initState as listsInit,
  PersistTransform as ListsTransform,
  State as ListsState
} from "./lists/reducer";

import { createOffline } from "@redux-offline/redux-offline";
import offlineConfig from "@redux-offline/redux-offline/lib/defaults";
import { OfflineState as ReduxOfflineState } from "@redux-offline/redux-offline/lib/types";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/es/storage";

interface IDAble {
  id: string;
}

export type Key<O, K extends keyof O> = O[K];

export class RecordItem<T extends IDAble> {
  public data: Record<string, T>;

  constructor(data = {} as Record<T["id"], T>) {
    this.data = data;
  }

  public fromArray(
    a: T[],
    transformer?: (o: T, index: number) => T
  ): RecordItem<T> {
    const map = a.reduce(
      (m, obj, index) => {
        if (transformer !== undefined) {
          obj = transformer(obj, index);
        }
        m[obj.id] = obj;
        return m;
      },
      {} as Record<string, T>
    );
    return new RecordItem<T>(map);
  }

  public all = (): T[] => {
    return Object.values(this.data);
  };

  public where = (fn: (obj: T) => boolean): RecordItem<T> => {
    return this.fromArray(this.all().filter(fn));
  };

  public get = (id: string): T | null => {
    return this.data[id];
  };

  public delete = (id: string): this => {
    if (!this.hasID(id)) {
      return this;
    }
    delete this.data[id];
    return this;
  };

  public updateID(from: string, to: string): this {
    this.data[to] = { ...this.data[from], id: to };
    delete this.data[from];
    return this;
  }

  public update(id: string, obj: Partial<T>): this {
    const newItem = { ...this.data[id], ...obj };
    this.data[id] = newItem;
    return this;
  }

  public copy = (): RecordItem<T> => {
    return new RecordItem<T>(this.data);
  };

  public hasID = (id: string): boolean => {
    return id in this.data;
  };
}

export interface OfflineResource extends IDAble {
  offline: {
    created: boolean;
    deleted: boolean;
  };
}

export class OfflineRecordItem<T extends OfflineResource> extends RecordItem<
  T
> {
  public copy = (): OfflineRecordItem<T> => {
    return new OfflineRecordItem<T>(this.data);
  };

  public fromArray(
    a: T[],
    transformer?: (o: T, index: number) => T
  ): OfflineRecordItem<T> {
    const map = a.reduce(
      (m, obj, index) => {
        if (transformer !== undefined) {
          obj = transformer(obj, index);
        }
        m[obj.id] = obj;
        return m;
      },
      {} as Record<string, T>
    );
    return new OfflineRecordItem<T>(map);
  }

  public where = (fn: (obj: T) => boolean): OfflineRecordItem<T> => {
    return this.fromArray(this.all().filter(fn));
  };

  public update(id: T["id"], obj: Partial<T>): this {
    // const isCreated = this.get(id)!.offline.created;
    // if (!isCreated) {
    // }
    RecordItem.prototype.update.call(this, id, obj);
    return this;
  }

  public markDeleted(id: T["id"]): this {
    this.data[id].offline.deleted = true;
    return this;
  }
}

export function orderRecords<T extends { [k: string]: any } & IDAble, K extends keyof T>(
  data: T[],
  key: K
): RecordItem<T> {
  return new RecordItem<T>().fromArray(data, (obj: T, index) => {
    obj[key as string] = index;
    return obj;
  });
}

const persistConfig = {
  key: "root",
  storage,
  transforms: [ListsTransform],
  whitelist: ["lists", "offline"]
};

const createTypes = { CREATE_BOARD_SUCCESS: ["UPDATE_BOARD"] };
const updateTypes = ["UPDATE_BOARD"];

const queue = new Queue(createTypes, a => updateTypes.includes(a.type));
const {
  middleware: offlineMiddleware,
  enhanceReducer: offlineEnhanceReducer,
  enhanceStore: offlineEnhanceStore
} = createOffline({
  ...offlineConfig,
  // offlineStateLens: (state: State): any => {
  //   const { offline, ...rest } = state;
  //   return {
  //     get: offline,
  //     set: (offlineState: any) =>
  //       typeof offlineState === "undefined"
  //         ? rest
  //         : { offline: offlineState, ...rest }
  //   };
  // },
  persist: false as any,
  queue,
  effect: async (effect, action) => {
    try {
      return await effect(action.payload);
    } catch (err) {
      throw await err.json();
    }
  }
});

export interface State {
  lists: ListsState;
  offline?: ReduxOfflineState;
}

const rootReducer = combineReducers<State>({
  lists
});

const persistedReducer = persistReducer(
  persistConfig,
  offlineEnhanceReducer(rootReducer)
);

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true })
  : compose;

const enhanceOffline = (
  reducer: (state: State, action: Action<any>) => State
) => {
  // take original reducer and return new one:
  return function(state: State, action: Action<any>): State {
    switch (action.type) {
      default:
        // just proxy all other actions
        return reducer(state, action);
    }
  };
};

export function makeStore(
  state: State = {
    lists: listsInit()
  }
) {
  const store = createStore(
    persistedReducer,
    state as any,
    composeEnhancers(
      offlineEnhanceStore,
      applyMiddleware(offlineMiddleware, asyncDispatchMiddleware)
    )
  );

  if ((module as any).hot) {
    // Enable Webpack hot module replacement for reducers
    (module as any).hot.accept("../stores", () => {
      const lists = require("./lists/reducer").default;
      const rootReducer = combineReducers<State>({
        lists
      });
      const nextReducer = persistReducer(
        persistConfig,
        offlineEnhanceReducer(rootReducer)
      );
      store.replaceReducer(enhanceOffline(nextReducer));
    });
  }

  const persistor = persistStore(store);
  return { persistor, store };
}
