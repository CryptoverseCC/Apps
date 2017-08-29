import { createStore, applyMiddleware, Middleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import rootReducer, { IWidgetState } from '../ducks';

const middlewares: Middleware[] = [
  ReduxThunk,
];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

const getStore = (widgetInitialState: IWidgetState) => createStore(
  rootReducer,
  { widget: widgetInitialState },
  applyMiddleware(...middlewares),
);

export default getStore;
