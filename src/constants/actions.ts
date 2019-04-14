import * as constants from "../constants";

export interface CreateList {
  type: constants.CREATE_LIST;
  payload: {
    name: string;
    id: string;
  };
}

export interface UpdateListName {
  type: constants.UPDATE_LIST_NAME;
  payload: {
    name: string;
    id: string;
  };
}

let nextListID = 0;
export function createList(name: string): Action {
  nextListID++;
  return {
    payload: {
      id: nextListID.toString(),
      name
    },
    type: constants.CREATE_LIST
  };
}

export function updateListName(id: string, name: string): Action {
  return {
    payload: {
      id,
      name
    },
    type: constants.UPDATE_LIST_NAME
  };
}

export type Action = CreateList | UpdateListName;
