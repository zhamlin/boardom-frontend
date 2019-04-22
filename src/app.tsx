import * as React from "react";

import "bulma/css/bulma.css";
import "./app.css";

import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import Board from "./components/board";
import Boards from "./components/boards";

function Home() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}

class App extends React.Component {
  public render() {
    return (
      <Router>
        <nav className="navbar app is-danger">
          <Link className="navbar-item" to="/">
            Home
          </Link>
          <Link className="navbar-item" to="/boards">
            Boards
          </Link>
        </nav>
        <Route exact={true} path="/" component={Home} />
        <Route exact={true} path="/boards" component={Boards} />
        <Route exact={true} path="/boards/:id" component={Board} />
      </Router>
    );
  }
}

export default App;
