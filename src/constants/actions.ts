import { createAction } from "../actions";
import {
  CREATE_BOARD,
  CREATE_CARD,
  CREATE_LIST,
  MOVE_CARD,
  MOVE_LIST,
  UPDATE_LIST_NAME
} from "../constants";

export interface CreateList {
  type: CREATE_LIST;
  payload: {
    name: string;
    boardID: string;
    id?: string;
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

export interface MoveCard {
  type: MOVE_CARD;
  payload: {
    id: string;
    destination: { listID: string; index: number };
    source: { listID: string; index: number };
  };
}
export const moveCard = createAction<MoveCard>(MOVE_CARD);

export interface CreateBoard {
  type: CREATE_BOARD;
  payload: {
    name: string;
    id: string;
  };
}
export const createBoard = createAction<CreateBoard>(CREATE_BOARD);

export type Actions =
  | CreateList
  | CreateCard
  | CreateBoard
  | UpdateListName
  | MoveList
  | MoveCard;
