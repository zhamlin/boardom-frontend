import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

import { Provider } from "react-redux";
import { makeStore } from "./stores";
import { cards } from "./stores/seed";

export const store = makeStore();
cards(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
