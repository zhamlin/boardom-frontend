import { combineReducers } from "redux";
import lists from "./lists";
import { State as ListsState } from "./lists";

export interface State {
  lists: Readonly<ListsState> | null;
}

export default combineReducers<State>({
  lists
});
