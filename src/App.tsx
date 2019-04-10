import * as React from 'react';

import 'bulma/css/bulma.css';
import './App.css'

import List from './components/list_item'

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
            <List name="Todohow long can we go we will never know, lets keep going" enthusiasmLevel={3} />
            <List name="Other" enthusiasmLevel={3} />
        </div>
    </div>
    );
  }
}

export default App;
