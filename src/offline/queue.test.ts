import Queue from "./queue";

const testResultAction = () => {
  return {
    meta: {} as any,
    type: "test"
  };
};

const testAction = () => {
  return {
    meta: {
      offline: {} as any
    },
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
