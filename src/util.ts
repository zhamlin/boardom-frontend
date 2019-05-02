import { Action } from "actions";

export class UnreachableCaseError extends Error {
  constructor(val: never) {
    super(`Unreachable case: ${val}`);
  }
}

export function filterActions(
  reducer: any,
  fn: (action: Action<any>) => boolean
): any {
  return (state: any = {}, action: Action<any>) => {
    if (!fn(action)) {
      return state;
    }

    return reducer(state, action);
  };
}
