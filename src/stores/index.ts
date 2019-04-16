import { combineReducers, createStore } from "redux";
import { List, ListItem, State as ListsState } from "./lists";
import lists from "./lists";

interface IDAble {
  id: string;
}

export class RecordItem<T extends IDAble> {
  private readonly data: Readonly<Record<string, T>>;

  constructor(data = {}) {
    this.data = data;
  }

  public items = (): T[] => {
    return Object.values(this.data);
  };

  public get = (id: string): T | null => {
    return this.data[id];
  };

  public update = (obj: T): RecordItem<T> => {
    return new RecordItem<T>({ ...this.data, [obj.id]: obj });
  };
}

export interface State {
  lists: Readonly<ListsState> | null;
}

const rootReducer = combineReducers<State>({
  lists
});

export function makeStore() {
  const store: Readonly<State> = {
    lists: {
      cards: new RecordItem<ListItem>(),
      items: new RecordItem<List>()
    }
  };
  return createStore(
    rootReducer,
    store,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  );
}
