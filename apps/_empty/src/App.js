import React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Home from './pages/Home'

const App = () => {
  return (
    <MuiThemeProvider>
      <Router>
        <div>
          <Route exact path="/" component={Home} />
        </div>
      </Router>
    </MuiThemeProvider>
  );
};

export default App;

