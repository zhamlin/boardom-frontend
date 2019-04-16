import * as React from "react";

import "bulma/css/bulma.css";
import "./app.css";

import Lists from "./components/lists";

class App extends React.Component {
  public render() {
    return (
      <>
        <nav className="navbar app is-danger">
          <a className="navbar-item">Home</a>
        </nav>
        <nav className="navbar board">board choice here</nav>
        <Lists />
      </>
    );
  }
}

export default App;
