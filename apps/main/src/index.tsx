import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import qs from 'qs';
import Raven from 'raven-js';

import web3, { Web3Provider, getInfura } from '@linkexchange/utils/web3';

import getStore from './store';
import App from './App';

import '../styles/all.scss';

const [, searchParams] = document.location.href.split('?');
const { startBlock, endBlock, ...widgetSettings } = qs.parse(searchParams);

const DEFAULT_WIDGET_SETTINGS = {
  apiUrl: 'https://api-staging.userfeeds.io',
  title: 'Title',
  description: 'Description',
  slots: 5,
  timeslot: 20,
  location: window.location.href,
  algorithm: 'links',
};

const store = getStore(
  { ...DEFAULT_WIDGET_SETTINGS, ...widgetSettings },
  { startBlock: parseInt(startBlock, 10), endBlock: parseInt(endBlock, 10) },
);

let infuraWeb3;
if (widgetSettings.asset) {
  const [network] = widgetSettings.asset.split(':');
  infuraWeb3 = getInfura(network);
}

const startApp = () => {
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
};

if (process.env.NODE_ENV !== 'development') {
  Raven.config('https://cf4174a2d1fb46dabc18269811d5b791@sentry.io/285390', {
    release: `${VERSION}-${process.env.NODE_ENV}`,
  }).install();
  Raven.context(() => startApp());
} else {
  startApp();
}
