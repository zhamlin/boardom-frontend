import { createStore } from "redux";
import reducer from "./reducers";
import { State } from "./reducers";

export function makeStore() {
  const store: State = { lists: { data: {} } };
  return createStore(
    reducer,
    store,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  );
}
