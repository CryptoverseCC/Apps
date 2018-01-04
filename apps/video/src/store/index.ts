import { createStore, applyMiddleware, combineReducers, Middleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import toast from '@linkexchange/toast/duck';
import links from '@linkexchange/details/duck';
import widget, { IWidgetState } from '@linkexchange/ducks/widget';

import bentyn, { IBlocksState } from '../ducks/blocks';

const middlewares: Middleware[] = [
  ReduxThunk,
];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

const getStore = (widgetInitialState: IWidgetState, blocksInitialState: IBlocksState) => createStore(
  combineReducers({ bentyn, links, widget, toast }),
  { widget: widgetInitialState, blocks: blocksInitialState },
  applyMiddleware(...middlewares),
);

export default getStore;
