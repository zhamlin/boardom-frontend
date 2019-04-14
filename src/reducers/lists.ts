import { Action, CREATE_LIST, UPDATE_LIST_NAME } from "../constants";

interface ListItem {
  id: string;
  name: string;
}

interface List {
  id: string;
  name: string;
  items: Readonly<Record<string, ListItem>>;
}

export interface State {
  data: Readonly<Record<string, List>>;
}

export default function reducer(
  state: State | null | undefined,
  action: Action
) {
  if (!state) {
    return null;
  }

  switch (action.type) {
    case UPDATE_LIST_NAME: {
      const data = { ...state.data };
      data[action.payload.id].name = action.payload.name;
      return { ...state, data };
    }

    case CREATE_LIST: {
      const data = { ...state.data };
      data[action.payload.id] = { ...action.payload, items: {} };
      return { ...state, data };
    }

    default:
      return state;
  }
}
