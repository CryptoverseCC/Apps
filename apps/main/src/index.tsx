import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import qs from 'qs';

import getStore from './store';
import App from './App';

import '../styles/all.scss';

const [, searchParams] = document.location.href.split('?');
const store = getStore(qs.parse(searchParams));

render((
  <Provider store={store}>
    <App />
  </Provider>),
  document.querySelector('.root'),
);