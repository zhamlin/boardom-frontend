import * as React from 'react';

import 'bulma/css/bulma.css';
import './App.css'

import List from './containers/list_item'

class App extends React.Component {
  public render() {
    return (
    <div className="ui">
        <nav className="navbar app is-danger">
            <a className="navbar-item">
              Home
            </a>
        </nav>
        <nav className="navbar board">board choice here</nav>
        <div className="lists">
            <List />
            <List />
        </div>
    </div>
    );
  }
}

export default App;
