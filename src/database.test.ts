import {
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

it("hasmany", () => {
  const x = { foo: true };
  const y = x.foo;
  x.foo = false;
  console.log(x, y);
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
  expect(b.lists().link.itemsByID).toMatchObject({
    one: { id: "one", boardID: "1" }
  });

  expect(sess.List.all().length).toBe(2);
  expect(sess.List).toMatchObject({
    itemsByID: { one: { id: "one", boardID: "1" } }
  });

  const todelete = b.lists().remove("1");
  todelete.delete();

  const newState = db.commit(sess);
  expect(Object.values(newState.List.itemsByID).length).toBe(1);
  expect(newState.List).toMatchObject({
    itemsByID: { one: { id: "one" } }
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
