import {
  OfflineAction,
  OfflineState,
  ResultAction
} from "@redux-offline/redux-offline/lib/types";
import { Action } from "redux";

interface OfflineContext {
  offline: OfflineState;
}

interface OfflineUpdateMessage {
  type: string;
  meta: {
    offline: OfflineState;
  };
  payload: {
    id: string | number;
  };
}

const sameActionTarget = (a: any, b: any): boolean => {
  return a.type === b.type && a.payload.id === b.payload.id;
};

type ActionFilter<T extends Action<any>> = (a: T) => boolean;

const actionWithPayloadID = (a: Action<any>): boolean => {
  return (a as any).payload && (a as any).payload.id !== undefined;
};

const getUniqueID = (a: OfflineUpdateMessage) => {
  return a.type + a.payload.id;
};

function removeEmpty<T extends { [k: string]: unknown }>(obj: T) {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === "object") removeEmpty(obj[key] as any);
    else if (obj[key] === undefined) delete obj[key];
  });
  return obj;
}

export default class Queue {
  private updateFilter: ActionFilter<OfflineAction>;
  private createUpdateSet: Record<string, string[]>;
  public updateMessages: Record<string, Array<OfflineUpdateMessage>>;

  constructor(
    createUpdateSet: Record<string, string[]> = {},
    updateFilter: ActionFilter<OfflineAction> = () => {
      return false;
    }
  ) {
    this.createUpdateSet = createUpdateSet;
    this.updateFilter = updateFilter;
    this.updateMessages = {};
  }

  // dequeue handles creation of resource and updates
  // any other messages that have the same id
  public dequeue = (
    actions: OfflineAction[],
    item: ResultAction,
    context: OfflineContext
  ): OfflineAction[] => {
    const [, ...rest] = actions;

    if (
      item.type !== "Offline/JS_ERROR" &&
      item.meta.success !== undefined &&
      !item.meta.success
    ) {
      const metaID: string = (item as any).meta.payload.id;
      const lastPayload = (item as any).meta.payload!;
      const history = this.updateMessages[item.type + metaID];
      return rest;
    }

    if (!actionWithPayloadID(item)) {
      return rest;
    }

    // TODO: check for failed updates
    const filters = this.createUpdateSet[item.type];
    if (filters === undefined) {
      return rest;
    }

    const metaID: string = (item as any).meta.payload.id;
    const itemID: string = (item as any).payload.id;
    return rest.map(a => {
      if (
        actionWithPayloadID(a) &&
        filters.includes(a.type) &&
        (a as any).payload.id === metaID
      ) {
        (a as any).payload.id = itemID;
        this.updateMessages[a.type + metaID] = [];
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

      const key = getUniqueID(action as any);
      const history = this.updateMessages[key] || [];
      history.push(...(squash as any));
      this.updateMessages[key] = history;
      squash.push(action);

      const squashedAction = squash.reduce((prev, current) => {
        return {
          meta: { ...prev.meta, ...current.meta },
          type: action.type,
          payload: {
            ...removeEmpty(prev.payload as any),
            ...removeEmpty(current.payload as any)
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
