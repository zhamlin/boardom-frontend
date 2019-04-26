import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { makeStore } from "./stores";
import { cards } from "./stores/seed";

export const { store, persistor } = makeStore();

// setTimeout(() => {
//   cards(store);
// }, 1000);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
