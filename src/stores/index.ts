import { combineReducers, createStore } from "redux";
import { State as ListsState } from "./lists/reducer";
import lists from "./lists/reducer";

interface IDAble {
  id: string;
}

export class RecordItem<T extends IDAble> {
  public readonly data: Readonly<Record<string, T>>;

  constructor(data: Record<string, T> = {}) {
    this.data = data;
  }

  public fromArray(
    a: T[],
    transformer?: (o: T, index: number) => T
  ): RecordItem<T> {
    const map = a.reduce((m, obj, index) => {
      if (transformer !== undefined) {
        obj = transformer(obj, index);
      }
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

  public updateAll = (objs: T[]): RecordItem<T> => {
    return new RecordItem<T>({
      ...this.data
    });
  };

  public update(id: string, obj: Partial<T>): RecordItem<T> {
    return new RecordItem<T>({
      ...this.data,
      [id]: { ...this.data[id], ...obj }
    });
  }

  public hasID = (id: string): boolean => {
    return id in this.data;
  };
}

export interface Positionable {
  getPosition: () => number;
  setPosition: (p: number) => void;
}

export function orderRecords<T extends IDAble, K extends keyof T>(
  data: T[],
  key: K
): RecordItem<T> {
  return new RecordItem<T>().fromArray(data, (obj: T, index) => {
    obj[key as string] = index;
    return obj;
  });
}

export interface State {
  readonly lists: ListsState;
}

const rootReducer = combineReducers<State>({
  lists
});

export function makeStore() {
  return createStore(
    rootReducer,
    {},
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  );
}
