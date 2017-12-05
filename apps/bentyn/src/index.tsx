import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import getStore from './store';
import App from './App';

import '../styles/all.scss';

const BENTYN_WIDGET_CONFIG = {
  apiUrl: 'https://api.userfeeds.io',
  recipientAddress: '0xC3D5a8A7ef7C1720F24C0A7874A96Cc7419D85F6',
  whitelist: '0xC3D5a8A7ef7C1720F24C0A7874A96Cc7419D85F6',
  asset: 'ropsten:0x44da4e9196be4fe6d06b942ac4f980390f015f82',
  algorithm: 'links',
  size: 'leaderboard',
  slots: 10,
  timeslot: 5,
  contactMethod: 'ben@userfeeds.io',
  title: 'Widget title',
  description: 'I accept only links that are about science and technology. I like bicycles',
  impression: '100 - 1.000',
  location: 'https://linkexchange.io/apps/bentyn',
};

const startBlock = 2205093;
const BENTYN_CONFIG = {
  startBlock,
  endBlock: startBlock + 6 * 60 * 24 * 1,
};

const store = getStore(BENTYN_WIDGET_CONFIG, BENTYN_CONFIG);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('.root'),
);
