import * as React from 'react';

import 'bulma/css/bulma.css';

class App extends React.Component {
  public render() {
    return (
    <div className="columns is-centered">
        <div className="column is-half" style={{paddingTop: '1%'}}>
            <div className="box is-primary">
                <article className="media">
                    <h1 className="title">
                        Hello World
                    </h1>
                </article>
            </div>
        </div>
    </div>
    );
  }
}

export default App;
