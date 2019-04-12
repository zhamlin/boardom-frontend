import { DECREMENT_ENTHUSIASM, INCREMENT_ENTHUSIASM } from './constants/index';
import {Action, StoreState} from './store';

export default function reducer(
  state: StoreState | null | undefined,
  action: Action,
) {

  if (!state) {
    return null;
  }

  switch (action.type) {
    case INCREMENT_ENTHUSIASM: {
        return { ...state, enthusiasmLevel: state.enthusiasmLevel + 1 };
      };

    case DECREMENT_ENTHUSIASM: {
      return { ...state, enthusiasmLevel: Math.max(1, state.enthusiasmLevel - 1) };
    }

    default:
      return state;
  }
}
