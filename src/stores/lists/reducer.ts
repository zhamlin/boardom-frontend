import { CREATE_CARD, CREATE_LIST, UPDATE_LIST_NAME } from "../../constants";
import { Actions } from "../../constants/actions";
import { RecordItem } from "../index";

export interface ListItem {
  id: string;
  listID: string;
  name: string;
}
export type ListItems = RecordItem<ListItem>;

export interface List {
  id: string;
  name: string;
}
export type Lists = RecordItem<List>;

export interface State {
  items: Lists;
  cards: ListItems;
}

export default function reducer(
  state: Readonly<State> = {
    cards: new RecordItem<ListItem>(),
    items: new RecordItem<List>()
  },
  action: Actions
): State {
  switch (action.type) {
    case UPDATE_LIST_NAME: {
      return { ...state, items: state.items.update(action.payload) };
    }

    case CREATE_CARD: {
      return { ...state, cards: state.cards.update(action.payload) };
    }

    case CREATE_LIST: {
      return { ...state, items: state.items.update(action.payload) };
    }

    default:
      return state;
  }
}
