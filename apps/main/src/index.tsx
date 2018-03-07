import { render } from 'react-dom';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'mobx-react';
import qs from 'qs';
import Raven from 'raven-js';
import ReactGA from 'react-ga';

import { IWidgetSettings } from '@linkexchange/types/widget';
import web3, { Web3Provider, getInfura, TNetwork } from '@linkexchange/utils/web3';
import { WidgetSettingsProvider } from '@linkexchange/widget-settings';

import BlocksStore from './stores/blocks';
import App from './App';

import '../styles/all.scss';
import Web3Store from '@linkexchange/web3-store';
import Erc20 from '@linkexchange/web3-store/erc20';

const [, searchParams] = document.location.href.split('?');
const { startBlock, endBlock, ...widgetSettingsFromParams } = qs.parse(searchParams);

const DEFAULT_WIDGET_SETTINGS = {
  apiUrl: 'https://api.userfeeds.io',
  title: 'Title',
  description: 'Description',
  slots: 5,
  timeslot: 20,
  location: window.location.href,
  algorithm: 'links',
  whitelist: '',
};

const widgetSettings: IWidgetSettings = { ...DEFAULT_WIDGET_SETTINGS, ...widgetSettingsFromParams };
const blocksStore = new BlocksStore(startBlock, endBlock);

let infuraWeb3;
if (widgetSettings.asset) {
  const [network] = widgetSettings.asset.split(':');
  infuraWeb3 = getInfura(network as TNetwork);
}

const web3Store = new Web3Store(web3, Erc20, { asset: widgetSettings.asset });
const startApp = () => {
  render(
    <Provider blocks={blocksStore} widgetSettingsStore={widgetSettings} web3Store={web3Store}>
      <IntlProvider locale="en">
        <App />
      </IntlProvider>
    </Provider>,
    document.querySelector('.root'),
  );
};

if (process.env.NODE_ENV !== 'development') {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize('UA-113862523-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  Raven.config('https://cf4174a2d1fb46dabc18269811d5b791@sentry.io/285390', {
    release: `${VERSION}-${process.env.NODE_ENV}`,
  }).install();
  Raven.context(() => startApp());
} else {
  startApp();
}
