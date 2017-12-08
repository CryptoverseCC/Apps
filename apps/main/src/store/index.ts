import { createStore, applyMiddleware, combineReducers, Middleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import toast from '@linkexchange/toast/duck';
import links from '@linkexchange/details/duck';
import widget, { IWidgetState } from '@linkexchange/ducks/widget';

const middlewares: Middleware[] = [
  ReduxThunk,
];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

const getStore = (widgetInitialState: IWidgetState) => createStore(
  combineReducers({ links, widget, toast }),
  { widget: widgetInitialState },
  applyMiddleware(...middlewares),
);

export default getStore;
