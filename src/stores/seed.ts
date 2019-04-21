import * as actions from "../constants/actions";

export function cards(store: any) {
  const lists = [{ name: "one", id: "0" }, { name: "two", id: "1" }];
  const cards = [
    { name: "one - first", id: "", listID: "0" },
    { name: "one - second", id: "", listID: "0" },
    { name: "two - first", id: "", listID: "1" },
    { name: "two - second", id: "", listID: "1" }
  ];
  lists.map(l => store.dispatch(actions.createList(l)));
  cards.map(c => store.dispatch(actions.createCard(c)));
}
