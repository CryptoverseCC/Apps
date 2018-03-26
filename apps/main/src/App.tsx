import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import RootToast from '@linkexchange/toast';
import Intercom from '@linkexchange/components/src/Intercom';

import Direct from './pages/Direct';
import Video from './pages/Video';

const App = () => (
  <Router>
    <div>
      <Route path="/direct" component={Direct} />
      <Route path="/video" component={Video} />
      <RootToast />
      <Intercom settings={{ app_id: 'xdam3he4' }} />
    </div>
  </Router>
);

export default App;
