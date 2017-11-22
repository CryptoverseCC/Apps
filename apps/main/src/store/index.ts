import { createStore, applyMiddleware, combineReducers, Middleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import toast from '@linkexchange/toast/duck';
import links from '@linkexchange/details/duck';
import web3 from '@linkexchange/web3-state-provider/duck';
import widget, { IWidgetState } from '@linkexchange/ducks/widget';
import tokenDetails from '@linkechange/token-details-provider/duck';

const middlewares: Middleware[] = [
  ReduxThunk,
];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

const getStore = (widgetInitialState: IWidgetState) => createStore(
  combineReducers({ web3, links, widget, toast, tokenDetails }),
  { widget: widgetInitialState },
  applyMiddleware(...middlewares),
);

export default getStore;
