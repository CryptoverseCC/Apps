import React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';

import RootModal from '@linkexchange/widgets/src/scenes/Banner/containers/RootModal'; // Extract it
import RootToast from '@linkexchange/widgets/src/scenes/Banner/containers/RootToast'; // Extract it

import Home from './pages/Home';
import Details from './pages/Details';
import Configurator from './pages/Configurator';

const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/details" component={Details} />
      <Route path="/configurator" component={Configurator} />
      <RootModal />
      <RootToast />
    </div>
  </Router>
);

export default App;
