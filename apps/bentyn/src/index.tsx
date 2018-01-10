import { render } from 'react-dom';
import React from 'react';
import qs from 'qs';
import { Provider } from 'react-redux';

import { IWidgetState } from '@linkexchange/ducks/widget';
import { EWidgetSize } from '@linkexchange/types/widget';
import web3, { getInfura, Web3Provider, TNetwork } from '@linkexchange/utils/web3';

import App from './App';
import getStore from './store';

import '../styles/all.scss';

const [, searchParams] = document.location.href.split('?');
const { startBlock, endBlock, ...widgetSettings } = qs.parse(searchParams);

const BENTYN_WIDGET_CONFIG: IWidgetState = {
  apiUrl: 'https://api-staging.userfeeds.io',
  recipientAddress: '0xC3D5a8A7ef7C1720F24C0A7874A96Cc7419D85F6',
  whitelist: '0xC3D5a8A7ef7C1720F24C0A7874A96Cc7419D85F6',
  asset: 'ethereum:0x108c05cac356d93b351375434101cfd3e14f7e44',
  algorithm: 'links',
  size: 'leaderboard' as EWidgetSize,
  slots: 5,
  timeslot: 5,
  contactMethod: 'ben@userfeeds.io',
  title: '',
  description: '',
  impression: '',
  location: window.location.href,
  ...widgetSettings,
};

const BENTYN_CONFIG = {
  startBlock: parseInt(startBlock, 10) || 4884495,
  endBlock: parseInt(endBlock, 10) || 5316495,
};

const store = getStore(BENTYN_WIDGET_CONFIG, BENTYN_CONFIG);

const [network] = BENTYN_WIDGET_CONFIG.asset.split(':');
const infuraWeb3 = getInfura(network as TNetwork);

render(
  <Provider store={store}>
    <Web3Provider injectedWeb3={web3} infuraWeb3={infuraWeb3}>
      <App />
    </Web3Provider>
  </Provider>,
  document.querySelector('.root'),
);
