import { render } from 'react-dom';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'mobx-react';
import qs from 'qs';
import Raven from 'raven-js';
import ReactGA from 'react-ga';

import web3, { Web3Provider, getInfura } from '@linkexchange/utils/web3';
import { WidgetSettingsProvider } from '@linkexchange/widget-settings';

import BlocksStore from './stores/blocks';
import App from './App';

import '../styles/all.scss';

const [, searchParams] = document.location.href.split('?');
const { startBlock, endBlock, ...widgetSettingsFromParams } = qs.parse(searchParams);

const DEFAULT_WIDGET_SETTINGS = {
  apiUrl: 'https://api-staging.userfeeds.io',
  title: 'Title',
  description: 'Description',
  slots: 5,
  timeslot: 20,
  location: window.location.href,
  algorithm: 'links',
};

const widgetSettings = { ...DEFAULT_WIDGET_SETTINGS, ...widgetSettingsFromParams };
const blocksStore = new BlocksStore(startBlock, endBlock);

let infuraWeb3;
if (widgetSettings.asset) {
  const [network] = widgetSettings.asset.split(':');
  infuraWeb3 = getInfura(network);
}

const startApp = () => {
  render(
    <WidgetSettingsProvider widgetSettings={widgetSettings}>
      <Provider blocks={blocksStore}>
        <IntlProvider locale="en">
          <Web3Provider injectedWeb3={web3} infuraWeb3={infuraWeb3}>
            <App />
          </Web3Provider>
        </IntlProvider>
      </Provider>
    </WidgetSettingsProvider>,
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
