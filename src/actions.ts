export interface Action<T> {
  type: T;
}

export interface PayloadAction<T, P> extends Action<T> {
  payload: P;
}

export interface Payloader<P> {
  payload: P;
}

export interface ErrorAction<T, E> extends Action<T> {
  error: E;
}

export function createAction<T extends Action<T>>(type: T["type"]): () => T;
export function createAction<T extends PayloadAction<T["type"], T["payload"]>>(
  type: T["type"]
): (payload: T["payload"]) => T;
export function createAction<T extends PayloadAction<T["type"], T["payload"]>>(
  type: T["type"]
) {
  return (payload: T["payload"]) => {
    return {
      payload,
      type
    };
  };
}

export function createOfflineAction<
  T extends PayloadAction<T["type"], T["payload"]>,
  S extends Action<any>,
  R extends Action<any>
>(
  type: T["type"],
  success: S["type"],
  rollback: R["type"],
  fn: (args: T["payload"]) => Promise<any>
) {
  return (payload: T["payload"]): OfflineAction<T> => {
    return {
      payload,
      type,
      meta: {
        offline: {
          effect: fn,
          commit: { type: success, meta: { payload } },
          rollback: { type: rollback, meta: { payload } }
        }
      }
    };
  };
}

// used to track all actions types created
class ActionCreator<A> {
  public readonly actions: Record<string, boolean>;

  constructor() {
    this.actions = {};
  }

  public isActionType = (action: Action<any>): boolean => {
    return this.actions[action.type];
  };

  public isType = (type: string): boolean => {
    return this.actions[type];
  };

  public newAction<T extends A & PayloadAction<T["type"], T["payload"]>>(
    type: T["type"]
  ) {
    this.actions[type as any] = true;
    return createAction(type);
  }

  public newOfflineAction<
    T extends A & PayloadAction<T["type"], T["payload"]>,
    S extends A & Action<any>,
    R extends A & Action<any>
  >(
    type: T["type"],
    success: S["type"],
    rollback: R["type"],
    fn: (args: T["payload"]) => Promise<any>
  ) {
    this.actions[type as any] = true;
    this.actions[success] = true;
    this.actions[rollback] = true;
    return createOfflineAction(type, success, rollback, fn);
  }
}

export function actionCreator<A>() {
  return new ActionCreator<A>();
}
export interface OfflineAction<
  T extends PayloadAction<T["type"], T["payload"]>
> {
  type: T["type"];
  payload: T["payload"];
  meta: {
    offline: {
      effect: any;
      commit: { type: any; meta: { payload: T["payload"] } };
      rollback: { type: any; meta: { payload: T["payload"] } };
    };
  };
}

export interface OfflineMeta<A extends PayloadAction<A["type"], A["payload"]>> {
  payload: A["payload"];
  success: boolean;
  completed: boolean;
}

export interface OfflineSuccess<
  A extends PayloadAction<A["type"], A["payload"]>
> {
  meta: OfflineMeta<A>;
}

export interface OfflineRollback<
  A extends PayloadAction<A["type"], A["payload"]>
> {
  payload: {
    name: string;
    status: number;
    response: string;
  };
  meta: OfflineMeta<A>;
}
