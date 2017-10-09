import React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';

import Home from './pages/Home';
import Status from './pages/Status';
import Whitelist from './pages/Whitelist';

const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/status" component={Status} />
      <Route path="/whitelist" component={Whitelist} />
    </div>
  </Router>
);

export default App;
