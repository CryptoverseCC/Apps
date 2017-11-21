import { createStore, applyMiddleware, combineReducers, Middleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import links, { ILinksState } from '@linkexchange/widgets/src/ducks/links';
import widget, { IWidgetState } from '@linkexchange/widgets/src/ducks/widget';

const middlewares: Middleware[] = [
  ReduxThunk,
];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

export interface IRootState {
  links: ILinksState;
  widget: IWidgetState;
}

const getStore = (widgetInitialState: IWidgetState) => createStore(
  combineReducers({ links, widget }),
  { widget: widgetInitialState },
  applyMiddleware(...middlewares),
);

export default getStore;
