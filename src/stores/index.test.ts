// import { Orderable } from "./index";
import { actionCreator } from "../actions";

export interface Item {
  id: string;
  name: string;
}

const NAME = "hello";

type B = typeof NAME;

it("does nothing", () => {
  // const creator = actionCreator();
  // const [start, success, failure] = creator.async("test", () => {});
  // const [testerName, tester] = creator.empty("test");
  // console.log(testerName, tester());
  // const [itemName, itemAction] = creator.payload<Item>("ITEM");
  // console.log(itemName, itemAction({ name: "hello", id: "ok" }));

  // const itemIndex = new Orderable<Item>({
  //   "1": 0,
  //   "2": 1,
  //   "3": 2
  // });
});
