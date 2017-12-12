import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import qs from 'qs';

import web3, { Web3Provider } from '@linkexchange/utils/web3';

import getStore from './store';
import App from './App';

import '../styles/all.scss';

const [, searchParams] = document.location.href.split('?');
const store = getStore(qs.parse(searchParams));

render((
  <Provider store={store}>
    <Web3Provider injectedWeb3={web3}>
      <App />
    </Web3Provider>
  </Provider>),
  document.querySelector('.root'),
);
