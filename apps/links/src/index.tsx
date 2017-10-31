import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import 'normalize.css';

import getStore from './store';
import App from './App';

import '../styles/all.scss';

const store = getStore();

render((
  <Provider store={store}>
    <App />
  </Provider>),
  document.querySelector('.root'),
);
