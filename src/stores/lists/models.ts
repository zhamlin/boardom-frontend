import * as boards from "apis/boardom";
import {
  uuid,
  field,
  Table,
  createClass,
  Database,
  HasMany,
  hasMany,
  StaticModel
} from "database";

export interface ListItem {
  id: string;
  listID: string;
  name: string;
  position: number;
}
export const ListItemModel = createClass<ListItem>("ListItem", {
  id: uuid(),
  name: field(),
  position: field(),
  listID: field()
});

export interface List {
  id: string;
  name: string;
  position: number;
  boardID: string;
  cards: HasMany<ListItem>;
}
export const ListModel = createClass<List>("List", {
  id: uuid(),
  name: field(),
  position: field(),
  boardID: field(),
  cards: hasMany<ListItem>(ListItemModel.modelName, "listID")
});

export interface Board extends Required<boards.TrelloBoard> {
  lists: HasMany<List>;
}
export const BoardModel = createClass<Board>("Board", {
  id: uuid(),
  name: field(),
  created_at: field(),
  updated_at: field(),
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

function createCRUDReducer(
  model: StaticModel<any>,
  database: Database<any>,
  overrides?: { [k: string]: Function }
) {
  const upperName = model.modelName.toUpperCase();
  return (state: any, action: any) => {
    const sess = database.session(state.db);
    const table = sess[model.modelName];
    switch (action.type) {
      case "CREATE_" + upperName:
        const item = table.create(action.payload);
        if (action.payload.id === undefined) {
          // allow us to update when the server responds
          action.payload.id = item.id;
        }
        if (overrides && overrides["CREATE"] !== undefined) {
          overrides["CREATE"](sess, action, item);
        }
        break;
      case "CREATE_" + upperName + "_SUCCESS":
        table
          .get(action.meta.payload.id!)!
          .update(action.payload)
          .updateID(action.payload.id!);
        break;
      case "CREATE_" + upperName + "_ROLLBACK":
        table.get(action.meta.payload.id!)!.delete();
        break;

      case "UPDATE_" + upperName:
        table.get(action.payload.id)!.update(action.payload);
        break;
      case "UPDATE_" + upperName + "_SUCCESS":
        table.get(action.payload.id)!.update(action.payload);
        break;
      case "UPDATE_" + upperName + "_ROLLBACK":
        // TODO
        break;
    }
    return { ...state, db: database.commit(sess) };
  };
}

// combine with actionsList, return the action and reducer
createCRUDReducer(ListItemModel, database, {
  CREATE: (sess: any, action: any, item: any) => {
    const list = sess.List.get(action.payload.listID);
    item.position = list.cards().all().length;
  }
});
export const test = createCRUDReducer(BoardModel, database);
