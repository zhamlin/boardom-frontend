import {
  CREATE_BOARD,
  CREATE_CARD,
  CREATE_LIST,
  MOVE_CARD,
  MOVE_LIST,
  UPDATE_LIST_NAME
} from "../../constants/lists";
import { orderRecords, RecordItem } from "../index";
import { Actions } from "./actions";

export interface ListItem {
  id: string;
  listID: string;
  name: string;
  position: number;
  boardID: string;
}
export type ListItems = RecordItem<ListItem>;

export interface Board {
  id: string;
  name: string;
}
export type Boards = RecordItem<Board>;

export interface List {
  id: string;
  name: string;
  position: number;
  boardID: string;
}
export type Lists = RecordItem<List>;

export interface State {
  items: Lists;
  cards: ListItems;
  boards: Boards;
}

let cardID = 0;
let listID = 0;
let boardID = 0;
export default function reducer(
  state: Readonly<State> = {
    cards: new RecordItem<ListItem>(),
    items: new RecordItem<List>(),
    boards: new RecordItem<Board>()
  },
  action: Actions
): State {
  switch (action.type) {
    case MOVE_CARD: {
      const { source, destination, id } = action.payload;
      if (source.listID === destination.listID) {
        const items = state.cards
          .all()
          .filter(c => c.listID === source.listID)
          .sort((a, b) => a.position - b.position);
        const [removed] = items.splice(source.index, 1);
        items.splice(destination.index, 0, removed);

        return {
          ...state,
          cards: new RecordItem<ListItem>({
            ...state.cards.data,
            ...orderRecords(items, "position").data
          })
        };
      }

      const sourceListCards = state.cards
        .all()
        .filter(c => c.listID === source.listID)
        .sort((a, b) => a.position - b.position);
      sourceListCards.splice(source.index, 1);

      const card = state.cards.get(id)!;
      const destListCards = state.cards
        .all()
        .filter(c => c.listID === destination.listID)
        .sort((a, b) => a.position - b.position);
      destListCards.splice(destination.index, 0, card);
      card.listID = destination.listID;

      return {
        ...state,
        cards: new RecordItem<ListItem>({
          ...state.cards.data,
          ...orderRecords(sourceListCards, "position").data,
          ...orderRecords(destListCards, "position").data
        })
      };
    }
    case MOVE_LIST: {
      const { currentPosition, newPosition } = action.payload;
      const items = state.items.all().sort((a, b) => a.position - b.position);
      const [removed] = items.splice(currentPosition, 1);
      items.splice(newPosition, 0, removed);

      return {
        ...state,
        items: orderRecords(items, "position")
      };
    }

    case UPDATE_LIST_NAME: {
      return {
        ...state,
        items: state.items.update(action.payload.id, action.payload)
      };
    }
    case CREATE_CARD: {
      const id = (cardID++).toString();
      action.payload.id = id;
      const { listID } = action.payload;
      return {
        ...state,
        cards: state.cards.update(id, {
          ...action.payload,
          position: state.cards.all().filter(c => c.listID === listID).length
        })
      };
    }

    case CREATE_BOARD: {
      const id = (boardID++).toString();
      action.payload.id = id;

      return {
        ...state,
        boards: state.boards.update(id, {
          ...action.payload
        })
      };
    }

    case CREATE_LIST: {
      const id = (listID++).toString();
      action.payload.id = id;

      return {
        ...state,
        items: state.items.update(id, {
          ...action.payload,
          position: state.items.all().length
        })
      };
    }

    default:
      return state;
  }
}
