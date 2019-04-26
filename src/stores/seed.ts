import * as actions from "./lists/actions";

export function cards(store: any) {
  const boards = [{ name: "main board", id: "0" }];
  const lists = [
    { name: "one", id: "0", boardID: "0" },
    { name: "two", id: "1", boardID: "0" }
  ];
  const cards = [
    { name: "one - first", id: "", listID: "0" },
    { name: "one - second", id: "", listID: "0" },
    { name: "two - first", id: "", listID: "1" },
    { name: "two - second", id: "", listID: "1" }
  ];
  boards.map(b => store.dispatch(actions.createBoard(b)));
  lists.map(l => store.dispatch(actions.createList(l)));
  cards.map(c => store.dispatch(actions.createCard(c)));
}
