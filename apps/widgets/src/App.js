import React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Home from './pages/Home'
import Details from './pages/Details';
import Configurator from './pages/Configurator';

const App = () => {
  return (
    <MuiThemeProvider>
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/details" component={Details} />
          <Route path="/configurator" component={Configurator} />
        </div>
      </Router>
    </MuiThemeProvider>
  );
};

export default App;

