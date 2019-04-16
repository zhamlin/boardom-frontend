import { CREATE_CARD, CREATE_LIST, UPDATE_LIST_NAME } from "../constants";

interface Action<T> {
  type: T;
}

interface PayloadAction<T, P> extends Action<T> {
  payload: P;
}

interface ErrorAction<T, E> extends Action<T> {
  error: E;
}

function createAction<T extends Action<T>>(type: T["type"]): () => T;
function createAction<T extends PayloadAction<T["type"], T["payload"]>>(
  type: T["type"]
): (payload: T["payload"]) => T;
function createAction<T extends PayloadAction<T["type"], T["payload"]>>(
  type: T["type"]
) {
  return (payload: T["payload"]) => {
    return {
      payload,
      type
    };
  };
}

export interface CreateList {
  type: CREATE_LIST;
  payload: {
    name: string;
    id: string;
  };
}
export const createList = createAction<CreateList>(CREATE_LIST);

export interface UpdateListName {
  type: UPDATE_LIST_NAME;
  payload: {
    name: string;
    id: string;
  };
}
export const updateListName = createAction<UpdateListName>(UPDATE_LIST_NAME);

export interface CreateCard {
  type: CREATE_CARD;
  payload: {
    name: string;
    id: string;
    listID: string;
  };
}
export const createCard = createAction<CreateCard>(CREATE_CARD);

export type Actions = CreateList | UpdateListName | CreateCard;
