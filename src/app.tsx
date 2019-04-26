import * as React from "react";

import "bulma/css/bulma.css";
import "./app.css";

import {
  BrowserRouter as Router,
  Link,
  Route,
  RouteComponentProps,
  Switch
} from "react-router-dom";
import Board from "./components/board";
import { LocalProps as BoardProps } from "./components/board";
import { LocalProps as BoardsProps } from "./components/board";
import Boards from "./components/boards";

import { store } from "./index";
import { selectBoard } from "./stores/lists/selectors";

function Home() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}

function NotFound({ location }: RouteComponentProps) {
  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

function BoardRoute({ match, location }: RouteComponentProps<BoardProps>) {
  if (selectBoard(store.getState(), match.params.id) == null) {
    return NotFound({ location } as RouteComponentProps);
  }
  return <Board id={match.params.id} />;
}

function BoardsRoute({ match }: RouteComponentProps<BoardsProps>) {
  return <Boards path={match.path} />;
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

        <Switch>
          <Route exact={true} path="/" component={Home} />
          <Route exact={true} path="/boards" component={BoardsRoute} />
          <Route exact={true} path="/boards/:id" component={BoardRoute} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default App;
