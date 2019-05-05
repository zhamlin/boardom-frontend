import {
  Action,
  applyMiddleware,
  combineReducers,
  compose,
  Store,
  createStore
} from "redux";
import asyncDispatchMiddleware from "middleware/asyncDispatch";
import Queue from "offline/queue";
import lists, {
  initState as listsInit,
  State as ListsState
} from "./lists/reducer";

import { composeWithDevTools } from "redux-devtools-extension";
import { createOffline } from "@redux-offline/redux-offline";
import offlineConfig from "@redux-offline/redux-offline/lib/defaults";
import {
  OfflineAction,
  OfflineState as ReduxOfflineState
} from "@redux-offline/redux-offline/lib/types";
import { persistReducer, persistStore, Persistor } from "redux-persist";
import storage from "localforage";
import invariant from "redux-immutable-state-invariant";

interface IDAble {
  id: string;
}

export type Key<O, K extends keyof O> = O[K];

export class RecordItem<T extends IDAble> {
  public data: Readonly<Record<string, T>>;

  constructor(data = {} as Record<string, T>) {
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

  public delete = (id: string): RecordItem<T> => {
    const data = { ...this.data };
    delete data[id];
    return new RecordItem<T>(data);
  };

  public updateID(from: string, to: string): RecordItem<T> {
    const data = { ...this.data, [to]: this.data[from] };
    delete data[from];
    return new RecordItem<T>(data);
  }

  public update(id: string, obj: Partial<T>): RecordItem<T> {
    const newItem = { ...this.data[id], ...obj };
    const data = { ...this.data, [id]: newItem };
    return new RecordItem<T>(data);
  }

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

export function orderRecords<
  T extends { [k: string]: any } & IDAble,
  K extends keyof T
>(data: T[], key: K): RecordItem<T> {
  return new RecordItem<T>().fromArray(data, (obj: T, index) => {
    return { ...obj, [key as string]: index };
  });
}

const persistConfig = {
  key: "root",
  storage,
  transforms: [],
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
  discard: (
    error: any,
    action: OfflineAction,
    _retries: number = 0
  ): boolean => {
    console.log("discard: ", error, action);
    // not a network error -> discard
    if (!("status" in error)) {
      return true;
    }

    // discard http 4xx errors
    return error.status >= 400 && error.status < 500;
  },

  effect: async (effect, action) => {
    if (typeof effect !== "function") {
      console.log(effect);
      return;
    }
    try {
      return await effect(action.payload);
    } catch (err) {
      console.log(err);
      if ("type" in err && err.type == "basic") {
        throw err;
      }
      throw await err.json();
    }
  }
});

export interface State {
  [k: string]: any;
  lists: ListsState;
  offline?: ReduxOfflineState;
}

const createReducer = () => {
  const rootReducer = combineReducers<State>({
    lists
  });

  const persistedReducer = persistReducer(
    persistConfig,
    offlineEnhanceReducer(rootReducer)
  );
  return persistedReducer;
};

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? composeWithDevTools({ trace: true, traceLimit: 25 })
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
): { persistor: Persistor; store: Store<State> } {
  const store = createStore(
    createReducer(),
    state,
    composeEnhancers(
      applyMiddleware(invariant(), offlineMiddleware, asyncDispatchMiddleware),
      offlineEnhanceStore
    )
  );

  const persistor = persistStore(store);
  return { persistor, store };
}
