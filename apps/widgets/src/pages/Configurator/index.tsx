import React from 'react';
import { Route } from 'react-router-dom';

import Paper from '@userfeeds/apps-components/src/Paper';

import Configure from './pages/Configure';
import Summary from './pages/Summary';

import * as style from './configurator.scss';

const Configurator = ({ match }) => (
  <div class={style.self}>
    <Paper class={style.paper}>
      <Route path={match.url + '/summary'} component={Summary} />
      <Route exact path={match.url} component={Configure} />
    </Paper>
  </div>
);

export default Configurator;
