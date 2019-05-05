import { createSelector, ParametricSelector, Selector } from "reselect";
import { State, Schema, database } from "./reducer";

export const selectSession: Selector<State, Schema> = state =>
  database.session(state.db);

export const selectItemID: ParametricSelector<State, any, string> = (_, id) =>
  id;

export const selectCards = createSelector(
  [selectSession],
  sess => {
    return sess.ListItem;
  }
);

export const selectBoards = createSelector(
  [selectSession],
  sess => {
    return sess.Board;
  }
);

export const selectLists = createSelector(
  [selectSession],
  sess => {
    return sess.List;
  }
);

export const selectBoard = createSelector(
  [selectBoards, selectItemID],
  (boards, id) => {
    return boards.get(id);
  }
);

export const selectBoardLists = createSelector(
  [selectLists, selectItemID],
  (lists, id) => {
    return lists
      .all()
      .filter(l => l.boardID === id)
      .sort((a, b) => a.position - b.position);
  }
);

export const getBoardNameInstance = () =>
  createSelector(
    [selectBoard],
    board => {
      return board!.name;
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
    lists => {
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
