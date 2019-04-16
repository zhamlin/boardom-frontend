import { createAction } from "../actions";
import { CREATE_CARD, CREATE_LIST, UPDATE_LIST_NAME } from "../constants";

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
