import React from 'react';
import { Router, Route } from 'react-router-dom';

import Home from './Home';
import Widget from './Widget';
import Dashboard from './Dashboard';
import Configurator from './Configurator';

const Video = ({ match }) => (
  <>
    <Route exact path={match.url} component={Home} />
    <Route path={match.url + '/dashboard'} component={Dashboard} />
    <Route path={match.url + '/configurator'} component={Configurator} />
    <Route path={match.url + '/widget'} component={Widget} />
  </>
);

export default Video;
