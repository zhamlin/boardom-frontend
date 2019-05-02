import { createTransform } from "redux-persist";
import { v4 as uuid } from "uuid";
import { filterActions, UnreachableCaseError } from "../../util";
import {
  Key,
  OfflineRecordItem,
  OfflineResource,
  orderRecords,
  RecordItem
} from "../index";
import {
  actionList,
  Actions,
  CREATE_BOARD,
  CREATE_BOARD_ROLLBACK,
  CREATE_BOARD_SUCCESS,
  CREATE_CARD,
  CREATE_LIST,
  MOVE_CARD,
  MOVE_LIST,
  UPDATE_BOARD,
  UPDATE_BOARD_ROLLBACK,
  UPDATE_BOARD_SUCCESS,
  UPDATE_LIST_NAME
} from "./actions";

export interface ListItem {
  id: string;
  listID: Key<List, "id">;
  name: string;
  position: number;
  boardID: Key<Board, "id">;
}
export type ListItems = RecordItem<ListItem>;

export interface Board extends OfflineResource {
  id: string;
  name: string;
}
export type Boards = OfflineRecordItem<Board>;

export interface List {
  id: string;
  name: string;
  position: number;
  boardID: Key<Board, "id">;
}
export type Lists = RecordItem<List>;

export interface State {
  items: Lists;
  cards: ListItems;
  boards: Boards;
}

export const PersistTransform = createTransform<State, State>(
  // transform state on its way to being serialized and persisted.
  inboundState => {
    return inboundState;
  },

  // transform state being rehydrated
  outboundState => {
    if (outboundState === null || outboundState === undefined) {
      return null as any;
    }
    const { boards, items, cards } = outboundState;
    return {
      ...outboundState,
      boards: new RecordItem<Board>(boards.data),
      cards: new RecordItem<ListItem>(cards.data),
      items: new RecordItem<List>(items.data)
    };
  },

  // define which reducers this transform gets called for.
  { whitelist: ["lists"] }
);

export const initState = (): State => {
  return {
    boards: new OfflineRecordItem<Board>(),
    cards: new RecordItem<ListItem>(),
    items: new RecordItem<List>()
  };
};

function reducer(state: Readonly<State>, action: Actions): State {
  switch (action.type) {
    case MOVE_CARD: {
      const { source, destination, id } = action.payload;
      if (source.listID === destination.listID) {
        const items = state.cards
          .copy()
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
        items: state.items.copy().update(action.payload.id, action.payload)
      };
    }

    case CREATE_BOARD: {
      const id = uuid();
      action.payload.id = id;
      return {
        ...state,
        boards: state.boards.copy().update(id, {
          ...action.payload,
          offline: { created: false, deleted: false }
        })
      };
    }

    case CREATE_BOARD_ROLLBACK: {
      return {
        ...state,
        boards: state.boards.copy().delete(action.meta.payload.id!)
      };
    }

    case CREATE_BOARD_SUCCESS: {
      // move to custom queue
      const boards = state.boards
        .copy()
        .updateID(action.meta.payload.id!, action.payload.id!);
      return {
        ...state,
        boards: boards.copy().update(action.payload.id!, {
          ...action.payload
        })
      };
    }

    case UPDATE_BOARD: {
      return {
        ...state,
        boards: state.boards.copy().update(action.payload.id, action.payload)
      };
    }

    case UPDATE_BOARD_SUCCESS: {
      return {
        ...state,
        boards: state.boards.copy().update(action.payload.id!, action.payload)
      };
    }

    case UPDATE_BOARD_ROLLBACK: {
      // restore to orignal state
      return {
        ...state
      };
    }

    case CREATE_CARD: {
      const id = uuid();
      action.payload.id = id;
      const { listID } = action.payload;
      return {
        ...state,
        cards: state.cards.copy().update(id, {
          ...action.payload,
          position: state.cards.all().filter(c => c.listID === listID).length
        })
      };
    }

    case CREATE_LIST: {
      const id = uuid();
      action.payload.id = id;

      return {
        ...state,
        items: state.items.copy().update(id, {
          ...action.payload,
          position: state.items.all().length
        })
      };
    }

    default:
      throw new UnreachableCaseError(action);
  }
}

// filter reducers down to actions we care about. Allows the switch
// to be checked that it handles all possible actions.
export default filterActions(reducer, a => actionList.isType(a.type));
