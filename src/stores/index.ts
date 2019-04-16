import { combineReducers, createStore } from "redux";
import { List, ListItem, State as ListsState } from "./lists/reducer";
import lists from "./lists/reducer";

interface IDAble {
  id: string;
}

export class RecordItem<T extends IDAble> {
  private readonly data: Readonly<Record<string, T>>;

  constructor(data: Record<string, T> = {}) {
    this.data = data;
  }

  public fromArray(a: T[]): RecordItem<T> {
    const map = a.reduce((m, obj) => {
      m[obj.id] = obj;
      return m;
    }, {});
    return new RecordItem<T>(map);
  }

  public all = (): T[] => {
    return Object.values(this.data);
  };

  public get = (id: string): T | null => {
    return this.data[id];
  };

  public update = (obj: T): RecordItem<T> => {
    return new RecordItem<T>({ ...this.data, [obj.id]: obj });
  };

  public hasID = (id: string): boolean => {
    return this.data.hasOwnProperty(id);
  };
}

export interface State {
  readonly lists: ListsState;
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
