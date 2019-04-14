import {createStore} from 'redux';
import {State as ListState} from './components/list/reducers';
import reducer from './reducer';

// export interface StoreState {
//     languageName: string;
//     enthusiasmLevel: number;
//     components?: Dictionary<any>;
// }

// export interface Store {
//   lists: Dictionary<ListState>
//   // lists: {
//   //   enthusiasmLevel: number,
//   //   name: string;
//   // }
// }

export class Storage {
    public lists: any;
}

export function makeStore() {
    const store = new Storage();
    store.lists = {};
    return createStore(reducer, { lists: { data: {} } },
        (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    );
}
