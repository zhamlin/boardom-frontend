import * as React from 'react';

import 'bulma/css/bulma.css';
import './App.css';

class App extends React.Component {
  public render() {
    return (
    <div className="ui">
        <nav className="navbar app is-info">
            <a className="navbar-item">
              Home
            </a>
        </nav>
        <nav className="navbar board is-warning">board choice here</nav>
        <div className="lists is-warning">
            <div className="list">
                <ul>
                    <li>l1</li>
                    <li>l2</li>
                    <li>l3</li>
                </ul>
            </div>
        </div>
    </div>
    );
  }
}

export default App;
