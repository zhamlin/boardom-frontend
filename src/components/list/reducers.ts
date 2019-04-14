import { CREATE_LIST, DECREMENT_ENTHUSIASM, INCREMENT_ENTHUSIASM, UPDATE_LIST_NAME } from '../../constants/index';
import {Action} from './actions';

export interface State {
    data: any;
}

export default function reducer(
  state: State | null | undefined,
  action: Action,
) {

  if (!state) {
    return null;
  }

  switch (action.type) {
    case INCREMENT_ENTHUSIASM: {
        return { ...state };
      };

    case UPDATE_LIST_NAME: {
        return { ...state, name: action.payload.name };
      };

    case CREATE_LIST: {
        state.data[action.payload.id] = action.payload
        return { ...state, data: state.data};
      };

    default:
      return state;
  }
}


