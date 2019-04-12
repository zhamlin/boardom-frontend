import {Action, createStore} from 'redux';
import {EnthusiasmAction} from './actions/index';
import reducer from './reducer';

export type Action = EnthusiasmAction

interface Dictionary<T> {
    [Key: string]: T;
}

export interface StoreState {
    languageName: string;
    enthusiasmLevel: number;
    components: Dictionary<any>;
}

export function makeStore() {
  return createStore(reducer, {
    components: {},
    enthusiasmLevel: 1,
    languageName: "typescript",
  },
   (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  );
}
