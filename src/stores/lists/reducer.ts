import { v4 as uuid } from "uuid";
import { filterActions, UnreachableCaseError } from "../../util";
import {
  field,
  Table,
  createClass,
  Database,
  HasMany,
  hasMany
} from "database";
import {
  actionList,
  ActionsType,
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
  listID: string;
  name: string;
  position: number;
  boardID: string;
}
const ListItemModel = createClass<ListItem>("ListItem", {
  id: field(),
  name: field(),
  position: field(),
  boardID: field(),
  listID: field()
});

export interface Board {
  id: string;
  name: string;
  lists: HasMany<List>;
}

export interface List {
  id: string;
  name: string;
  position: number;
  boardID: string;
  cards: HasMany<ListItem>;
}
const ListModel = createClass<List>("List", {
  id: field(),
  name: field(),
  position: field(),
  boardID: field(),
  cards: hasMany<ListItem>(ListItemModel.modelName, "listID")
});

const BoardModel = createClass<Board>("Board", {
  id: field(),
  name: field(),
  lists: hasMany<List>(ListModel.modelName, "boardID")
});

export interface Schema {
  Board: Table<Board>;
  List: Table<List>;
  ListItem: Table<ListItem>;
}

export const database = new Database<Schema>();
database.register(BoardModel, ListModel, ListItemModel);

export interface State {
  db: Schema;
}

export const initState = (): State => {
  return {
    db: database.emptyState()
  };
};

function updatePosition<T extends { position: number }>(
  items: T[],
  sourcePos: number,
  destPos: number
) {
  items.sort((a, b) => a.position - b.position);
  const [removed] = items.splice(sourcePos, 1);
  items.splice(destPos, 0, removed);
  return order(items);
}

function order<T extends { position: number }>(items: T[]) {
  return items.map((value, index) => {
    value.position = index;
    return value;
  });
}

function reducer(state: Readonly<State>, action: ActionsType): State {
  const sess = database.session(state.db);
  switch (action.type) {
    case MOVE_CARD: {
      const { source, destination, id } = action.payload;
      if (source.listID === destination.listID) {
        const items = updatePosition(
          sess.ListItem.all(),
          source.index,
          destination.index
        );
        sess.ListItem.updateAll(...items);
        return {
          ...state,
          db: database.commit(sess)
        };
      }

      const sourceListCards = sess.ListItem.all()
        .filter(c => c.listID === source.listID)
        .sort((a, b) => a.position - b.position);
      sourceListCards.splice(source.index, 1);

      const card = sess.ListItem.get(id)!;
      const destListCards = sess.ListItem.all()
        .filter(c => c.listID === destination.listID)
        .sort((a, b) => a.position - b.position);
      destListCards.splice(destination.index, 0, card);
      card.listID = destination.listID;

      sess.ListItem.updateAll(
        ...order(sourceListCards),
        ...order(destListCards)
      );
      return {
        ...state,
        db: database.commit(sess)
      };
    }
    case MOVE_LIST: {
      const { currentPosition, newPosition } = action.payload;
      sess.List.updateAll(
        ...updatePosition(sess.List.all(), currentPosition, newPosition)
      );
      return {
        ...state,
        db: database.commit(sess)
      };
    }

    case UPDATE_LIST_NAME: {
      sess.List.get(action.payload.id)!.update(action.payload);
      return {
        ...state,
        db: database.commit(sess)
      };
    }

    case CREATE_BOARD: {
      const id = uuid();
      action.payload.id = id;
      sess.Board.create({ id: id, ...action.payload });
      return {
        ...state,
        db: database.commit(sess)
      };
    }

    case CREATE_BOARD_ROLLBACK: {
      sess.Board.get(action.meta.payload.id!)!.delete();
      return {
        ...state,
        db: database.commit(sess)
      };
    }

    case CREATE_BOARD_SUCCESS: {
      sess.Board.get(action.meta.payload.id!)!
        .update(action.payload)
        .updateID(action.payload.id!);
      return {
        ...state,
        db: database.commit(sess)
      };
    }

    case UPDATE_BOARD: {
      sess.Board.get(action.payload.id)!.update(action.payload);
      return {
        ...state,
        db: database.commit(sess)
      };
    }

    case UPDATE_BOARD_SUCCESS: {
      sess.Board.get(action.payload.id!)!.update(action.payload);
      return {
        ...state,
        db: database.commit(sess)
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
      const list = sess.List.get(action.payload.listID)!;

      action.payload.id = id;
      const c = sess.ListItem.create({
        ...action.payload,
        position: list.cards().all().length
      });
      list.cards().add(c);
      return {
        ...state,
        db: database.commit(sess)
      };
    }

    case CREATE_LIST: {
      const id = uuid();
      action.payload.id = id;
      sess.List.create({
        ...action.payload,
        id: id,
        position: sess.List.all().length
      });

      return {
        ...state,
        db: database.commit(sess)
      };
    }

    default:
      throw new UnreachableCaseError(action);
  }
}

// filter reducers down to actions we care about. Allows the switch
// to be checked that it handles all possible actions.
export default filterActions(reducer, actionList.isActionType);
