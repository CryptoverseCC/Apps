import { createStore, applyMiddleware, Middleware, Reducer, StoreEnhancer, Store } from 'redux';
import ReduxThunk from 'redux-thunk';

import { IRootState } from '../ducks';
import { initialState } from '../ducks/widget';

import rootReducer, { IWidgetState } from '../ducks';

type TDeepPartial<T> = {
  [K in keyof T]?: TDeepPartial<T[K]>
};

type TStoreCreator =
  <S>(reducer: Reducer<S>, preloadedState: TDeepPartial<S>, enhancer?: StoreEnhancer<S>) => Store<S>;

const middlewares: Middleware[] = [
  ReduxThunk,
];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

const cS: TStoreCreator = createStore;

const getStore = (widgetInitialState: Partial<IWidgetState>) => cS<IRootState>(
  rootReducer,
  {
    widget: {
      ...initialState,
      ...widgetInitialState,
    },
  },
  applyMiddleware(...middlewares),
);

export default getStore;
