import {
  uuid,
  field,
  Table,
  Database,
  createClass,
  HasMany,
  hasMany
} from "database";

interface List {
  id: string;
  name: string;
  position: number;

  boardID: string;
}
interface Board {
  id: string;
  name: string;
  lists: HasMany<List>;
}
interface Schema {
  List: Table<List>;
  Board: Table<Board>;
}

it("has many", () => {
  const ListModel = createClass<List>("List", {
    id: field(),
    name: field(),
    position: field(),
    boardID: field()
  });
  const BoardModel = createClass<Board>("Board", {
    id: field(),
    name: field(),
    lists: hasMany<List>(ListModel.modelName, "boardID")
  });

  const db = new Database<Schema>();
  db.register(ListModel, BoardModel);

  const sess = db.session(db.emptyState());
  const b = sess.Board.create({ id: "1", name: "testing" });

  sess.List.create({ id: "1", name: "testing" });
  const list = sess.List.create({ id: "one" });
  b.lists().add(list);

  expect(b.lists().all().length).toBe(1);
  expect(sess.List.all().length).toBe(2);
  expect(sess.List).toMatchObject({
    itemsByID: {
      one: { id: "one", boardID: "1" },
      "1": { id: "1", name: "testing" }
    }
  });

  b.lists().remove(list);
  expect(list).toMatchObject({
    id: "one"
  });
  list.delete();

  const newState = db.commit(sess);
  expect(Object.values(newState.List.itemsByID).length).toBe(1);
  expect(newState.List).toMatchObject({
    itemsByID: { "1": { id: "1" } }
  });
});

it("preforms basic CRUD", () => {
  const BoardModel = createClass<Board>("Board", {
    id: field(),
    name: field(),
    lists: field()
  });
  const db = new Database<Schema>();
  db.register(BoardModel);

  const sess = db.session(db.emptyState());
});

it("uuid default works", () => {
  const ListModel = createClass<List>("List", {
    id: uuid(),
    name: field(),
    position: field(),
    boardID: field()
  });

  const db = new Database<Schema>();
  db.register(ListModel);
  const sess = db.session(db.emptyState());
  const list = sess.List.create();
  const list2 = sess.List.create({ id: "test" });
  expect(list.id).toBeDefined();
  expect(list2.id).toEqual("test");
});
