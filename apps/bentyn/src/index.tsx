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
const parsedParams = qs.parse(searchParams);

const parsedParamsBlocks = {
  startBlock: parsedParams.startBlock,
  endBlock: parsedParams.endBlock,
};

delete parsedParams.startBlock;
delete parsedParams.endBlock;

const BENTYN_WIDGET_CONFIG: IWidgetState = {
  apiUrl: 'https://api.userfeeds.io',
  recipientAddress: '0xC3D5a8A7ef7C1720F24C0A7874A96Cc7419D85F6',
  whitelist: '0xC3D5a8A7ef7C1720F24C0A7874A96Cc7419D85F6',
  asset: 'ropsten:0x44da4e9196be4fe6d06b942ac4f980390f015f82',
  algorithm: 'links',
  size: 'leaderboard' as EWidgetSize,
  slots: 2,
  timeslot: 5,
  contactMethod: 'ben@userfeeds.io',
  title: '',
  description: '',
  impression: '',
  location: window.location.href,
  ...parsedParams,
};

const startBlock = 2205093;
const BENTYN_CONFIG = {
  startBlock,
  endBlock: startBlock + 6 * 60 * 24 * 27,
  ...parsedParamsBlocks,
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
