import { createStore, applyMiddleware, combineReducers, Middleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import web3 from '@linkexchange/widgets/src/ducks/web3';
import links from '@linkexchange/widgets/src/ducks/links';
import modal from '@linkexchange/widgets/src/ducks/modal';
import toast from '@linkexchange/widgets/src/ducks/toast';
import widget, { IWidgetState } from '@linkexchange/widgets/src/ducks/widget';

const middlewares: Middleware[] = [
  ReduxThunk,
];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

const getStore = (widgetInitialState: IWidgetState) => createStore(
  combineReducers({ web3, links, widget, modal, toast }),
  { widget: widgetInitialState },
  applyMiddleware(...middlewares),
);

export default getStore;
