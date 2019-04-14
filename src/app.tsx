import * as React from "react";

import "bulma/css/bulma.css";
import "./app.css";

import { createList } from "./constants/actions";
import Lists from "./containers/lists";
import { store } from "./index";

const addList = () => {
  store.dispatch(createList("test"));
};

class App extends React.Component {
  public render() {
    return (
      <>
        <nav className="navbar app is-danger">
          <a onClick={addList} className="navbar-item">
            Home
          </a>
        </nav>
        <nav className="navbar board">board choice here</nav>
        <Lists />
      </>
    );
  }
}

export default App;
