import React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Status from './status';
import Whitelist from './whitelist';

const App = () => {
  return (
    <MuiThemeProvider>
      <Router>
        <div>
          <Route path="/status" component={Status}/>
          <Route path="/whitelist" component={Whitelist}/>
        </div>
      </Router>
    </MuiThemeProvider>
  );
};

export default App;

