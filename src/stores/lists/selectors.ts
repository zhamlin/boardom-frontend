import { createSelector, ParametricSelector, Selector } from "reselect";
import { State } from "../index";
import { ListItems, Lists } from "./reducer";

const selectLists: Selector<State, Lists> = state => state.lists.items;
const selectCards: Selector<State, ListItems> = state => state.lists.cards;
const selectItemID: ParametricSelector<State, any, string> = (_, id) => id;

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
      const data = cards.all().filter(c => c.listID === id);
      return cards.fromArray(data);
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
      return lists;
    }
  );

export const getCardNameInstance = () =>
  createSelector(
    [selectCard],
    card => {
      return card.name;
    }
  );
