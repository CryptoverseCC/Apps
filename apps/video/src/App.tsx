import React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';

import RootToast from '@linkexchange/toast/RootToast';
import Intercom from '@linkexchange/components/src/Intercom';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Configurator from './pages/Configurator';

const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/configurator" component={Configurator} />
      <Route exact path="/dashboard" component={Dashboard} />
      <RootToast />
      <Intercom settings={{ app_id: 'xdam3he4' }} />
    </div>
  </Router>
);

export default App;
