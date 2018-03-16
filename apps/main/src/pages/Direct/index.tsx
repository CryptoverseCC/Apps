import React from 'react';
import { Route } from 'react-router-dom';

import Details from './Details';
import Status from './Status';
import Whitelist from './Whitelist';
import Configurator from './Configurator';

const Direct = ({ match }) => (
  <>
    <Route path={match.url + '/status'} component={Status} />
    <Route path={match.url + '/details'} component={Details} />
    <Route path={match.url + '/whitelist'} component={Whitelist} />
    <Route path={match.url + '/configurator'} component={Configurator} />
  </>
);

export default Direct;
