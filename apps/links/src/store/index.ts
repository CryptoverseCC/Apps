import { createStore, applyMiddleware, combineReducers, Middleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import web3 from '@linkexchange/widgets/src/ducks/web3';

const middlewares: Middleware[] = [
  ReduxThunk,
];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

const getStore = () => createStore(
  combineReducers({ web3 }),
  applyMiddleware(...middlewares),
);

export default getStore;
