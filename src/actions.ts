export interface Action<T> {
  type: T;
}

export interface PayloadAction<T, P> extends Action<T> {
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
