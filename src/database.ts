import { v4 as uuidGen } from "uuid";

interface IDAble {
  id: string;
}

interface ForiegnKey {
  table: string;
}

interface Many2Many {
  type: "Many2Many";
}

export type HasMany<T extends IDAble> = () => HasManyClass<T>;

export class HasManyClass<T extends IDAble> {
  private link: Table<T>;
  private linkField: string;
  private id: string;

  constructor(id: string, link: Table<T>, linkedField: string) {
    this.id = id;
    this.link = link;
    this.linkField = linkedField;
  }

  add(m: Model<T> & T) {
    m.update({ [this.linkField]: this.id } as any);
  }

  remove(m: Model<T> & T) {
    m.update({ [this.linkField]: undefined } as any);
  }

  all() {
    return this.link.all().filter((m: any) => m[this.linkField] === this.id);
  }
}

export function hasMany<T>(table: string, link: keyof T): HasManyType {
  return { type: "hasmany", table, link: link as string };
}

export function uuid(): FieldType {
  return { type: "field", default: uuidGen };
}

export function field(): FieldType {
  return { type: "field" };
}

interface HasManyType {
  type: "hasmany";
  table: string;
  link: string;
}

interface StaticModelProps {
  modelName: string;
  fields: Fields;
}

interface FieldType {
  type: "field";
  default?: Function;
}

// has many creates a seperate table to track the relationship
type FieldTypes = FieldType | HasManyType;
type Fields = { [field: string]: FieldTypes };

interface ModelExtra {
  session: { [k: string]: Table<Model<any>> };
}

export class Model<T extends IDAble> {
  static modelName: string;
  static fields: Fields;
  static many() {}

  public id: string;
  private state: Table<T>;

  constructor(fields: Partial<T>, state: Table<T>) {
    Object.assign(this, fields);
    this.state = state;
  }

  public clean() {
    const { state, ...other } = this;
    return other;
  }

  public updateID(newID: string): this {
    if (newID === this.id) {
      return this;
    }

    const oldID = this.id;
    Object.assign(this, { ...this.state.itemsByID[oldID], id: newID });
    this.state.itemsByID[newID] = this as any;
    delete this.state.itemsByID[oldID];
    return this;
  }

  public update(args: Partial<T>): this {
    const { id, ...noid } = args;
    Object.assign(this.state.itemsByID[this.id], {
      ...this.state.itemsByID[this.id],
      ...noid
    });
    return this;
  }

  public delete() {
    delete this.state.itemsByID[this.id];
  }
}

interface ModelFunctionConstructor<A extends IDAble, R> {
  new (fields: Partial<A>, state: Table<A>, extra?: ModelExtra): R;
  (fields: Partial<A>, state: Table<A>, extra?: ModelExtra): R;
  readonly prototype: R;
}
type Constructor<A extends IDAble, R, T> = ModelFunctionConstructor<A, R> & T;

export type StaticModel<T extends IDAble> = Constructor<
  T,
  Model<T> & T,
  StaticModelProps
>;

type Session = { [k: string]: Table<any> };
const getHelper = (field: FieldTypes) => {
  switch (field.type) {
    case "hasmany":
      return (session: Session, id: string) => {
        return new HasManyClass(id, session[field.table], field.link);
      };
  }
};

export function createClass<Fields extends IDAble>(
  name: string,
  fields: { [T in keyof Fields]: FieldTypes }
): StaticModel<Fields> {
  const model = class extends Model<Fields> {
    constructor(
      args: Partial<Fields> = {},
      state: Table<Fields>,
      extra?: ModelExtra
    ) {
      super(args, state);

      if (extra === undefined) {
        return this;
      }

      Object.keys(fields).forEach(name => {
        const field = (fields as any)[name] as FieldTypes;
        switch (field.type) {
          case "field":
            if (field.default !== undefined) {
              if ((this as any)[name] === undefined) {
                (this as any)[name] = field.default();
              }
            }
            break;
        }
      });

      const links = Object.entries(fields)
        .filter(value => value[1].type === "hasmany")
        .reduce(
          (newLinks, current) => {
            const linkFunc = getHelper(current[1]);
            if (linkFunc === undefined) {
              return newLinks;
            }
            newLinks[current[0]] = () => {
              return linkFunc(extra.session, this.id);
            };
            return newLinks;
          },
          {} as { [k: string]: any }
        );
      Object.assign(this, links);

      return this;
    }
  };

  model.modelName = name;
  model.fields = fields;
  return model as any;
}

export class Table<Item extends IDAble> {
  public itemsByID: { [id: string]: Model<Item> & Item };
  private model: StaticModel<any>;
  private session: { [k: string]: Table<any> };

  public updateAll = (...items: Array<Model<Item> & Item>) => {
    items.forEach(i => {
      this.itemsByID[i.id] = i;
    });
  };

  public commit = () => {
    const items = { ...this.itemsByID };
    Object.keys(items).forEach(id => {
      const other = this.itemsByID[id].clean();
      items[id] = other as any;
    });
    return { itemsByID: items };
  };

  public all = () => {
    return Object.values(this.itemsByID);
  };

  public get = (id: string): (Model<Item> & Item) | undefined => {
    return this.itemsByID[id];
  };

  public create = (args?: Partial<Item>): Model<Item> & Item => {
    const item = new this.model({ ...args }, this, { session: this.session });
    this.itemsByID[item.id] = item;
    return item;
  };

  constructor(
    items: { [id: string]: Model<Item> & Item },
    constructor: StaticModel<any>,
    session: { [k: string]: Table<any> }
  ) {
    this.itemsByID = items || {};
    this.session = session;
    this.model = constructor;

    Object.keys(this.itemsByID).forEach(
      id =>
        (this.itemsByID[id] = new constructor(this.itemsByID[id], this, {
          session: this.session
        }))
    );
  }
}

export class Database<Schema extends { [T in keyof Schema]: Table<any> }> {
  public tables: { [k: string]: new (...args: any[]) => unknown };

  constructor() {
    this.tables = {} as any;
  }

  public emptyState(): Schema {
    const state: Record<string, Table<any>> = {};
    Object.keys(this.tables).forEach(table => {
      state[table] = new Table({}, class {} as any, undefined as any);
    });
    return state as Schema;
  }

  public register(...models: StaticModel<any>[]) {
    models.forEach(m => {
      this.tables[m.modelName] = m;
    });
  }

  // load all the specific class stuff here
  public session(state: Schema): Schema {
    const session = {} as Schema;
    Object.keys(this.tables).forEach(table => {
      (session as any)[table] = new Table(
        // copy the table over
        { ...(state as any)[table].itemsByID },
        this.tables[table] as any,
        session
      );
    });
    return session;
  }

  public commit(session: Schema): Schema {
    const clearedSession = {} as any;
    Object.keys(this.tables).forEach(table => {
      clearedSession[table] = (session as any)[table].commit();
    });
    return clearedSession;
  }
}
