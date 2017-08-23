import React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';

import Home from './pages/Home'

const App = () => {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Home} />
      </div>
    </Router>
  );
};

export default App;

