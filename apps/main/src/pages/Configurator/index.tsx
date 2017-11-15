import React from 'react';
import { Route } from 'react-router-dom';

import Paper from '@linkexchange/components/src/Paper';
import Intercom from '@linkexchange/components/src/Intercom';

import Configure from './pages/Configure';
import Summary from './pages/Summary';

import * as style from './configurator.scss';

const Configurator = ({ match }) => (
  <div className={style.self}>
    <Intercom settings={{ app_id: 'xdam3he4' }} />
    <Paper className={style.paper}>
      <Route path={match.url + '/summary'} component={Summary} />
      <Route exact path={match.url} component={Configure} />
    </Paper>
  </div>
);

export default Configurator;
