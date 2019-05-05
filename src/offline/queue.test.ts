import Queue from "./queue";

const testResultAction = () => {
  return {
    meta: {} as any,
    type: "test"
  };
};

interface Update {
  id: string;
  name: string;
  age: number;
}

const testUpdateRollback = (id: string, other: any) => {
  return {
    payload: { message: "reason for error", code: 13 },
    meta: {
      completed: true,
      success: false,
      payload: {
        id: id,
        ...other
      }
    },
    type: "update"
  };
};

const testCreateSuccess = (id: string) => {
  return {
    payload: { id: id + "real" },
    meta: {
      completed: true,
      success: true,
      payload: {
        id: id
      }
    },
    type: "created"
  };
};

const testUpdate = (id: string, { name, age }: Partial<Update> = {}) => {
  return {
    payload: { id, name, age },
    meta: { offline: {} as any },
    type: "update"
  };
};

const testAction = () => {
  return {
    meta: { offline: {} as any },
    type: "test"
  };
};

it("queues and dequeues actions correctly", () => {
  const q = new Queue();
  const actions = q.enqueue([], testAction(), {} as any);
  expect(actions.length).toBe(1);
  const dequeued = q.dequeue(actions, testResultAction(), {} as any);
  expect(dequeued.length).toBe(0);
});

it("squashes updated messages with the same id", () => {
  const q = new Queue({}, () => true);
  let actions = q.enqueue([], testUpdate("id"), {} as any);
  expect(actions.length).toBe(1);
  actions = q.enqueue(actions, testUpdate("id", { name: "test" }), {} as any);
  actions = q.enqueue(
    actions,
    testUpdate("id", { name: "something else", age: 10 }),
    {} as any
  );
  expect(actions.length).toBe(1);
  expect(q.peek(actions, {}, {} as any)).toMatchObject({
    payload: {
      name: "something else",
      age: 10
    }
  });

  actions = q.enqueue(actions, testUpdate("id", { age: 11 }), {} as any);
  expect(q.peek(actions, {}, {} as any)).toMatchObject({
    payload: {
      age: 11,
      name: "something else"
    }
  });
});

it("updates all ids after created success message", () => {
  const q = new Queue({ created: ["update"] }, () => true);
  const localID = "id";
  let actions = q.enqueue([], testUpdate(localID), {} as any);
  actions = q.enqueue(
    actions,
    testUpdate(localID, { name: "test" }),
    {} as any
  );
  actions = q.enqueue(
    actions,
    testUpdate(localID, { name: "new name", age: 10 }),
    {} as any
  );
  actions = q.enqueue(actions, testUpdate(localID, { age: 11 }), {} as any);
  actions
    .filter(a => a.type === "update")
    .map(a => expect((a.payload as any).id).toEqual(localID));
  const success = testCreateSuccess(localID);
  actions = q.dequeue(actions, success, {} as any);
  actions
    .filter(a => a.type === "update")
    .map(a => expect((a.payload as any).id).toEqual(localID + "real"));
});

it("keeps a chain of updated messages for possible retries", () => {
  const q = new Queue({}, () => true);
  let actions = q.enqueue([], testUpdate("id"), {} as any);
  actions = q.enqueue(actions, testUpdate("id", { name: "test" }), {} as any);
  actions = q.enqueue(
    actions,
    testUpdate("id", { name: "new name", age: 10 }),
    {} as any
  );
  actions = q.enqueue(actions, testUpdate("id", { age: 11 }), {} as any);

  // action type+id
  const key = "updateid";
  expect(q.updateMessages[key].length).toBe(3);
});

it("retries from update history", () => {
  const q = new Queue({}, () => true);
  const id = "id";

  let actions = q.enqueue([{} as any], testUpdate(id), {} as any);
  actions = q.enqueue(actions, testUpdate(id, { name: "test" }), {} as any);
  actions = q.enqueue(
    actions,
    testUpdate(id, { name: "new name", age: 10 }),
    {} as any
  );
  const lastUpdate = { age: 11 };
  actions = q.enqueue(actions, testUpdate(id, lastUpdate), {} as any);

  // action type+id
  const key = "updateid";
  expect(q.updateMessages[key].length).toBe(3);

  const rollback = testUpdateRollback(id, actions[actions.length - 1].payload);
  actions = q.dequeue(actions, rollback, {} as any);

  // on fail, look at meta payload
});

it("updated messages history cleared on success", () => {
  const q = new Queue({ created: ["update"] }, () => true);
  const id = "id";

  // initial create message
  let actions = q.enqueue([], {} as any, {} as any);
  actions = q.enqueue(actions, testUpdate(id), {} as any);
  actions = q.enqueue(actions, testUpdate(id, { name: "test" }), {} as any);
  actions = q.enqueue(
    actions,
    testUpdate(id, { name: "new name", age: 10 }),
    {} as any
  );
  actions = q.enqueue(actions, testUpdate(id, { age: 11 }), {} as any);

  // action type+id
  const key = "update" + id;
  expect(q.updateMessages[key].length).toBe(3);
  const success = testCreateSuccess(id);
  actions = q.dequeue(actions, success, {} as any);

  // not sure if we should clear all, might need them incase of multiple errors
  // expect(q.updateMessages[key].length).toBe(3);
});
