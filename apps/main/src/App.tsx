import React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';

import RootToast from '@linkexchange/toast/RootToast';
import Intercom from '@linkexchange/components/src/Intercom';

import Home from './pages/Home';
import Details from './pages/Details';
import Status from './pages/Status';
import Whitelist from './pages/Whitelist';
import Configurator from './pages/Configurator';

const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/details" component={Details} />
      <Route path="/configurator" component={Configurator} />
      <Route path="/status" component={Status} />
      <Route path="/whitelist" component={Whitelist} />
      <RootToast />
      <Intercom settings={{ app_id: 'xdam3he4' }} />
    </div>
  </Router>
);

export default App;
