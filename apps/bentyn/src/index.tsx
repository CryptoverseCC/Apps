import { render } from 'react-dom';
import React from 'react';
import qs from 'qs';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';

import { IWidgetState } from '@linkexchange/ducks/widget';
import { EWidgetSize } from '@linkexchange/types/widget';
import web3, { getInfura, Web3Provider, TNetwork } from '@linkexchange/utils/web3';

import App from './App';
import getStore from './store';

import '../styles/all.scss';

const [, searchParams] = document.location.href.split('?');
const { startBlock, endBlock, ...widgetSettings } = qs.parse(searchParams);

const BENTYN_CONFIG = {
  startBlock: parseInt(startBlock, 10) || 4884495,
  endBlock: parseInt(endBlock, 10) || 5357637,
};

const BENTYN_WIDGET_CONFIG: IWidgetState = {
  apiUrl: 'https://api.userfeeds.io',
  recipientAddress: '0xD7Bad27E6B797952382860C581A7E4c90BeA5Deb',
  whitelist: '0xD7Bad27E6B797952382860C581A7E4c90BeA5Deb',
  asset: 'ethereum:0x108c05cac356d93b351375434101cfd3e14f7e44',
  algorithm: `betweenblocks;minBlockNumber=${BENTYN_CONFIG.startBlock};maxBlockNumber=${BENTYN_CONFIG.endBlock}`,
  size: 'leaderboard' as EWidgetSize,
  slots: 7,
  timeslot: 5,
  contactMethod: 'ben@userfeeds.io',
  title: '',
  description: '',
  impression: '',
  location: window.location.href,
  minimalLinkFee: '1',
  ...widgetSettings,
};

const store = getStore(BENTYN_WIDGET_CONFIG, BENTYN_CONFIG);

const [network] = BENTYN_WIDGET_CONFIG.asset.split(':');
const infuraWeb3 = getInfura(network as TNetwork);

render(
  <Provider store={store}>
    <IntlProvider locale="en">
      <Web3Provider injectedWeb3={web3} infuraWeb3={infuraWeb3}>
        <App />
      </Web3Provider>
    </IntlProvider>
  </Provider>,
  document.querySelector('.root'),
);
