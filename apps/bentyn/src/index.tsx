import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import getStore from './store';
import App from './App';

import '../styles/all.scss';

const BENTYN_WIDGET_CONFIG = {
  apiUrl: 'https://api.userfeeds.io',
  recipientAddress: '0xcd73518680ab60ec2253841909d3448bc60f0665',
  asset: 'ropsten:0x31d46d605703f66bd3ea95f699ddec9114fe9b89',
  algorithm: 'links',
  size: 'leaderboard',
  slots: 10,
  timeslot: 5,
  contactMethod: 'maciej.gorski@userfeeds.io',
  title: 'Widget title',
  description: 'I accept only links that are about science and technology. I like bicycles',
  impression: '100 - 1.000',
};

// const startBlock = 3158896;
const startBlock = 2158896;
const BENTYN_CONFIG = {
  startBlock,
  endBlock: startBlock + 6 * 60 * 24 * 7,
};

const store = getStore(BENTYN_WIDGET_CONFIG, BENTYN_CONFIG);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('.root'),
);
