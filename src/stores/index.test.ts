import { Indexable } from "./index";

export interface Item {
  id: string;
  name: string;
}

it("does nothing", () => {
  const item_index = new Indexable<Item>({
    "1": 0,
    "2": 1,
    "3": 2
  });
});
