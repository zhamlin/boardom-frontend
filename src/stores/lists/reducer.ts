import {
  CREATE_CARD,
  CREATE_LIST,
  MOVE_LIST,
  UPDATE_LIST_NAME
} from "../../constants";
import { Actions } from "../../constants/actions";
import { Indexable, RecordItem } from "../index";

export interface ListItem {
  id: string;
  listID: string;
  name: string;
  position: number;
}
export type ListItems = RecordItem<ListItem>;

export interface List {
  id: string;
  name: string;
  position: number;
}
export type Lists = RecordItem<List>;

export interface State {
  items: Lists;
  items_position: Indexable<List>;
  cards: ListItems;
}

export default function reducer(
  state: Readonly<State> = {
    cards: new RecordItem<ListItem>(),
    items: new RecordItem<List>(),
    items_position: new Indexable<List>()
  },
  action: Actions
): State {
  switch (action.type) {
    case MOVE_LIST: {
      // find current list
      // find list to move
      // find all inbetween, and shift correct direction
      const { currentPosition, newPosition } = action.payload;
      const toMove = state.items
        .all()
        .filter(l => l.position === currentPosition)
        .slice(-1)[0];

      const other = state.items
        .all()
        .filter(l => l.position === newPosition)
        .slice(-1)[0];

      if (other === undefined || toMove === undefined) {
        return { ...state };
      }

      return {
        ...state,
        items: state.items
          .update(other.id, { position: currentPosition })
          .update(toMove.id, { position: newPosition })
      };
    }

    case UPDATE_LIST_NAME: {
      return {
        ...state,
        items: state.items.update(action.payload.id, action.payload)
      };
    }

    case CREATE_CARD: {
      return {
        ...state,
        cards: state.cards.update(action.payload.id, action.payload)
      };
    }

    case CREATE_LIST: {
      return {
        ...state,
        items: state.items.update(action.payload.id, {
          ...action.payload,
          position: Number(action.payload.id)
        })
      };
    }

    default:
      return state;
  }
}
