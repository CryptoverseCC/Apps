import { createStore, applyMiddleware, Middleware } from 'redux';
import ReduxThunk from 'redux-thunk'

import rootReducer from '../reducers';

const middlewares: Middleware[] = [
  ReduxThunk,
];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

const getStore = (widgetInitialState) => createStore(
  rootReducer,
  { widget: widgetInitialState },
  applyMiddleware(...middlewares),
);

export default getStore;