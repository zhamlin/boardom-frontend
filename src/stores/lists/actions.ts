import { createAction } from "../../actions";
import {
  CREATE_BOARD,
  CREATE_CARD,
  CREATE_LIST,
  MOVE_CARD,
  MOVE_LIST,
  UPDATE_BOARD_NAME,
  UPDATE_LIST_NAME
} from "../../constants/lists";

export interface CreateList {
  type: typeof CREATE_LIST;
  payload: {
    name: string;
    boardID: string;
    id?: string;
  };
}
export const createList = createAction<CreateList>(CREATE_LIST);

export interface UpdateListName {
  type: typeof UPDATE_LIST_NAME;
  payload: {
    name: string;
    id: string;
  };
}
export const updateListName = createAction<UpdateListName>(UPDATE_LIST_NAME);

export interface CreateCard {
  type: typeof CREATE_CARD;
  payload: {
    name: string;
    id: string;
    listID: string;
  };
}
export const createCard = createAction<CreateCard>(CREATE_CARD);

export interface MoveList {
  type: typeof MOVE_LIST;
  payload: {
    currentPosition: number;
    newPosition: number;
  };
}
export const moveList = createAction<MoveList>(MOVE_LIST);

export interface MoveCard {
  type: typeof MOVE_CARD;
  payload: {
    id: string;
    destination: { listID: string; index: number };
    source: { listID: string; index: number };
  };
}
export const moveCard = createAction<MoveCard>(MOVE_CARD);

export interface CreateBoard {
  type: typeof CREATE_BOARD;
  payload: {
    name: string;
    id?: string;
  };
}
export const createBoard = createAction<CreateBoard>(CREATE_BOARD);

export interface UpdateBoardName {
  type: typeof UPDATE_BOARD_NAME;
  payload: {
    name: string;
    id: string;
  };
}
export const updateBoardName = createAction<UpdateBoardName>(UPDATE_BOARD_NAME);

export type Actions =
  | CreateList
  | CreateCard
  | CreateBoard
  | UpdateListName
  | UpdateBoardName
  | MoveList
  | MoveCard;
