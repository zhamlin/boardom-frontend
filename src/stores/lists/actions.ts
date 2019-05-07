import { actionCreator, OfflineRollback, OfflineSuccess } from "actions";
import * as boards from "apis/boardom";

export const actionList = actionCreator<ActionsType>();
const api = new boards.BoardsApi({ basePath: "http://localhost:3000" });

export const CREATE_LIST = "CREATE_LIST";
export interface CreateList {
  type: typeof CREATE_LIST;
  payload: {
    name: string;
    boardID: string;
    id?: string;
  };
}
export const createList = actionList.newAction<CreateList>(CREATE_LIST);

export const UPDATE_LIST_NAME = "UPDATE_LIST_NAME";
export interface UpdateListName {
  type: typeof UPDATE_LIST_NAME;
  payload: {
    name: string;
    id: string;
  };
}
export const updateListName = actionList.newAction<UpdateListName>(
  UPDATE_LIST_NAME
);

export const CREATE_CARD = "CREATE_CARD";
export interface CreateCard {
  type: typeof CREATE_CARD;
  payload: {
    name: string;
    id?: string;
    listID: string;
  };
}
export const createCard = actionList.newAction<CreateCard>(CREATE_CARD);

export const MOVE_LIST = "MOVE_LIST";
export interface MoveList {
  type: typeof MOVE_LIST;
  payload: {
    currentPosition: number;
    newPosition: number;
  };
}
export const moveList = actionList.newAction<MoveList>(MOVE_LIST);

export const MOVE_CARD = "MOVE_CARD";
export interface MoveCard {
  type: typeof MOVE_CARD;
  payload: {
    id: string;
    destination: { listID: string; index: number };
    source: { listID: string; index: number };
  };
}
export const moveCard = actionList.newAction<MoveCard>(MOVE_CARD);

export const UPDATE_BOARD_ROLLBACK = "UPDATE_BOARD_ROLLBACK";
export interface UpdateBoardRollback extends OfflineRollback<UpdateBoard> {
  type: typeof UPDATE_BOARD_ROLLBACK;
}

export const UPDATE_BOARD_SUCCESS = "UPDATE_BOARD_SUCCESS";
export interface UpdateBoardSuccess extends OfflineSuccess<UpdateBoard> {
  type: typeof UPDATE_BOARD_SUCCESS;
  payload: boards.TrelloBoard;
}

export const UPDATE_BOARD = "UPDATE_BOARD";
export interface UpdateBoard {
  type: typeof UPDATE_BOARD;
  payload: {
    name: string;
    id: string;
    tempID?: boolean;
  };
}
export const updateBoard = actionList.newOfflineAction<
  UpdateBoard,
  UpdateBoardSuccess,
  UpdateBoardRollback
>(UPDATE_BOARD, UPDATE_BOARD_SUCCESS, UPDATE_BOARD_ROLLBACK, payload => {
  return api.updateBoard({ board: { id: payload.id, name: payload.name } });
});

export const CREATE_BOARD_ROLLBACK = "CREATE_BOARD_ROLLBACK";
export interface CreateBoardRollback extends OfflineRollback<CreateBoard> {
  type: typeof CREATE_BOARD_ROLLBACK;
}

export const CREATE_BOARD_SUCCESS = "CREATE_BOARD_SUCCESS";
export interface CreateBoardSuccess extends OfflineSuccess<CreateBoard> {
  type: typeof CREATE_BOARD_SUCCESS;
  payload: boards.TrelloBoard;
}

export const CREATE_BOARD = "CREATE_BOARD";
export interface CreateBoard {
  type: typeof CREATE_BOARD;
  payload: {
    name: string;
    id?: string;
  };
}

// all of the names can be derived from a model
export const createBoard = actionList.newOfflineAction<
  CreateBoard,
  CreateBoardSuccess,
  CreateBoardRollback
>(CREATE_BOARD, CREATE_BOARD_SUCCESS, CREATE_BOARD_ROLLBACK, payload => {
  return api.createBoard({ name: payload.name });
});

export type ActionsType =
  | CreateList
  | CreateCard
  | CreateBoard
  | CreateBoardSuccess
  | CreateBoardRollback
  | UpdateBoard
  | UpdateBoardSuccess
  | UpdateBoardRollback
  | UpdateListName
  | MoveCard
  | MoveList;
