import { createAction } from "../actions";
import {
  CREATE_CARD,
  CREATE_LIST,
  MOVE_LIST,
  UPDATE_LIST_NAME
} from "../constants";

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

export interface MoveList {
  type: MOVE_LIST;
  payload: {
    currentPosition: number;
    newPosition: number;
  };
}
export const moveList = createAction<MoveList>(MOVE_LIST);

export type Actions = CreateList | UpdateListName | CreateCard | MoveList;
