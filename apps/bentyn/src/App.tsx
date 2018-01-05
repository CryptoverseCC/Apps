import React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';

import RootToast from '@linkexchange/toast/RootToast';

import Home from './pages/Home';

const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <RootToast />
    </div>
  </Router>
);

export default App;
