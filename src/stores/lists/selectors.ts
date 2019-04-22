import { createSelector, ParametricSelector, Selector } from "reselect";
import { State } from "../index";
import { Boards, ListItems, Lists } from "./reducer";

export const selectLists: Selector<State, Lists> = state => state.lists.items;
export const selectBoards: Selector<State, Boards> = state =>
  state.lists.boards;
export const selectCards: Selector<State, ListItems> = state =>
  state.lists.cards;
export const selectItemID: ParametricSelector<State, any, string> = (_, id) =>
  id;

export const selectBoard = createSelector(
  [selectBoards, selectItemID],
  (boards, id) => {
    return boards.get(id)!;
  }
);

export const selectBoardLists = createSelector(
  [selectLists, selectItemID],
  (lists, id) => {
    return lists.all().filter(l => l.boardID === id);
  }
);

export const getBoardNameInstance = () =>
  createSelector(
    [selectBoard],
    board => {
      return board.name;
    }
  );

const selectList = createSelector(
  [selectLists, selectItemID],
  (lists, id) => {
    return lists.get(id)!;
  }
);

const selectCard = createSelector(
  [selectCards, selectItemID],
  (cards, id) => {
    return cards.get(id)!;
  }
);

export const getAllListCardsInstance = () =>
  createSelector(
    [selectCards, selectItemID],
    (cards, id) => {
      return cards
        .all()
        .filter(c => c.listID === id)
        .sort((a, b) => a.position - b.position);
    }
  );

export const getListNameInstance = () =>
  createSelector(
    [selectList],
    list => {
      return list.name;
    }
  );

export const getAllListsInstance = () =>
  createSelector(
    [selectLists],
    (lists: Lists) => {
      return lists.all().sort((a, b) => a.position - b.position);
    }
  );

export const getCardNameInstance = () =>
  createSelector(
    [selectCard],
    card => {
      return card.name;
    }
  );
