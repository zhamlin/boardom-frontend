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
import lists from "./lists/reducer";
import { initState as listsInit, State as ListsState } from "./lists/models";

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
      return;
    }
    try {
      const result = await effect(action.payload);
      return result;
    } catch (err) {
      console.log(err);
      if ("type" in err && err.type === "basic") {
        throw err;
      }
      throw await err.json();
    }
  }
});

export interface State {
  lists: ListsState;
  offline?: ReduxOfflineState;
}

const createReducer = () => {
  const rootReducer = combineReducers<State>({
    lists
  });

  // handle passing other reducer state in to reducers
  const reducer = (state: State, action: Action<unknown>) => {
    (state.lists as any).offline = state.offline!;
    const newState = rootReducer(state, action) as any;
    delete newState.lists.offline;
    return newState;
  };

  const persistedReducer = persistReducer(
    persistConfig,
    offlineEnhanceReducer(reducer)
  );
  return persistedReducer;
};

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? composeWithDevTools({ trace: true, traceLimit: 25 })
  : compose;

export function makeStore(
  state: State = {
    lists: listsInit()
  }
): { persistor: Persistor; store: Store<State> } {
  const store = createStore(
    createReducer(),
    state as any,
    composeEnhancers(
      offlineEnhanceStore as any,
      applyMiddleware(offlineMiddleware, asyncDispatchMiddleware) as any
    )
  );

  const persistor = persistStore(store);
  return { persistor, store };
}
