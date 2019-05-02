import { Action, Middleware } from "redux";
import { State } from "stores";

export interface DispatchAction {
  asyncDispatch: (a: Action<any>) => void;
}

// from https://lazamar.github.io/dispatching-from-inside-of-reducers/
const asyncDispatchMiddleware: Middleware<
  (a: Action<any>) => void,
  State
> = store => next => (action: Action<any>) => {
  let syncActivityFinished = false;
  let actionQueue: Array<Action<any>> = [];

  function flushQueue() {
    actionQueue.forEach(a => store.dispatch(a)); // flush queue
    actionQueue = [];
  }

  function asyncDispatch(asyncAction: Action<any>) {
    actionQueue = actionQueue.concat([asyncAction]);

    if (syncActivityFinished) {
      flushQueue();
    }
  }

  const actionWithAsyncDispatch: Action<any> & DispatchAction = {
    ...action,
    asyncDispatch
  };

  next(actionWithAsyncDispatch);
  syncActivityFinished = true;
  flushQueue();
};
export default asyncDispatchMiddleware;
