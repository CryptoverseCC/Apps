import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Paper from '@linkexchange/components/src/Paper';

import Configure from './components/Configure';
import Summary from './components/Summary';

import * as style from './configurator.scss';

const Configurator = ({ match }) => (
  <div className={style.self}>
    <Paper className={style.paper}>
      <Route exact path={match.url} component={Configure} />
      <Route path={match.url + '/summary'} component={Summary} />
    </Paper>
  </div>
);

export default Configurator;
