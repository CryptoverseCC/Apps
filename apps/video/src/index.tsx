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

const DEFAULT_WIDGET_SETTINGS = {
  apiUrl: 'https://api.userfeeds.io',
  title: 'Title',
  description: 'Description',
  slots: 2,
  timeslot: 5,
  location: window.location.href,
  algorithm: 'links',
};

const store = getStore(
  { ...DEFAULT_WIDGET_SETTINGS, ...widgetSettings },
  { startBlock: parseInt(startBlock, 10), endBlock: parseInt(endBlock, 10) },
);

const [network] = widgetSettings.asset && widgetSettings.asset.split(':') || ['ropsten'];
const infuraWeb3 = getInfura(network as TNetwork);

render(
  <Provider store={store}>
    <Web3Provider injectedWeb3={web3} infuraWeb3={infuraWeb3}>
      <App />
    </Web3Provider>
  </Provider>,
  document.querySelector('.root'),
);
