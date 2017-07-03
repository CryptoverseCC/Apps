import React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Home from './pages/Home';
import Status from './pages/Status';
import Whitelist from './pages/Whitelist';
import LinkList from './pages/LinkList';

const App = () => (
  <MuiThemeProvider>
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/status" component={Status} />
        <Route path="/whitelist" component={Whitelist} />
        <Route path="/linklist" component={LinkList} />
      </div>
    </Router>
  </MuiThemeProvider>
);

export default App;

