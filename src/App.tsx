import * as React from 'react';

import 'bulma/css/bulma.css';
import './App.css'

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
            <div className="list">
                <h3 className="list-title">List title</h3>
                <ul className="list-items">
                    <li> item1 </li>
                    <li> item1 </li>
                    <li> item1 </li>
                    <li> item1 </li>
                    <li> item1 </li>
                    <li> item1 </li>
                    <li> item1 </li>
                    <li> item1 </li>
                    <li> item1 </li>
                    <li> item1 </li>
                    <li> item1 </li>
                    <li> item1 </li>
                </ul>
                <a className="list-button button is-light">Add card</a>
            </div>
        </div>
    </div>
    );
  }
}

export default App;
