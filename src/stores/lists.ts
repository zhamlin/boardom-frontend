import { CREATE_CARD, CREATE_LIST, UPDATE_LIST_NAME } from "../constants";
import { Actions } from "../constants/actions";
import { RecordItem } from "./index";

export interface ListItem {
  id: string;
  listID: string;
  name: string;
}

export interface List {
  id: string;
  name: string;
}

export interface State {
  items: RecordItem<List>;
  cards: RecordItem<ListItem>;
}

export default function reducer(
  state: Readonly<State> | null | undefined,
  action: Actions
): State | null {
  if (!state) {
    return null;
  }

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
