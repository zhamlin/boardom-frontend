import {
  OfflineAction,
  OfflineState,
  ResultAction
} from "@redux-offline/redux-offline/lib/types";
import { Action } from "redux";

interface OfflineContext {
  offline: OfflineState;
}

const sameActionTarget = (a: any, b: any): boolean => {
  return a.type === b.type && a.payload.id === b.payload.id;
};

type ActionFilter<T extends Action<any>> = (a: T) => boolean;

const actionWithPayloadID = (a: Action<any>): boolean => {
  return (
    (a as any).payload !== undefined && (a as any).payload.id !== undefined
  );
};

export default class Queue {
  public updateFilter: ActionFilter<OfflineAction>;
  public createUpdateSet: Record<string, string[]>;

  constructor(
    createUpdateSet: Record<string, string[]> = {},
    updateFilter: ActionFilter<OfflineAction> = () => {
      return false;
    }
  ) {
    this.createUpdateSet = createUpdateSet;
    this.updateFilter = updateFilter;
  }

  // dequeue handles creation of resource and updates
  // any other messages that have the same id
  public dequeue = (
    actions: OfflineAction[],
    item: ResultAction,
    context: OfflineContext
  ): OfflineAction[] => {
    const [, ...rest] = actions;
    if (!actionWithPayloadID(item)) {
      return rest;
    }

    // TODO: check for failed updates
    const filters = this.createUpdateSet[item.type];
    if (filters === undefined) {
      return rest;
    }

    return rest.map(a => {
      if (
        actionWithPayloadID(a) &&
        filters.includes(a.type) &&
        (a as any).payload.id !== (item as any).meta.payload.id
      ) {
        (a as any).payload.id = (item as any).payload.id;
      }
      return a;
    });
  };

  // enqueue combines all updates into one update
  // TODO: maintain history of diffs to allow trying each update
  // sequentially if the prior one fails.
  public enqueue = (
    actions: OfflineAction[],
    action: OfflineAction,
    context: OfflineContext
  ): OfflineAction[] => {
    if (this.updateFilter(action)) {
      const squash = actions.filter(a => sameActionTarget(a, action));
      if (squash.length === 0) {
        return [...actions, action];
      }
      squash.push(action);
      const squashedAction = squash.reduce((prev, current) => {
        return {
          meta: { ...prev.meta, ...current.meta },
          type: action.type,
          payload: {
            ...prev.payload,
            ...current.payload
          }
        };
      });
      return [
        ...actions.filter(a => !sameActionTarget(a, action)),
        squashedAction
      ];
    }
    return [...actions, action];
  };

  public peek = (
    actions: OfflineAction[],
    item: any,
    context: OfflineContext
  ): OfflineAction => {
    return actions[0];
  };
}
