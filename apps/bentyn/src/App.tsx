import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import RootToast from '@linkexchange/toast';

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
