import { render } from 'react-dom';
import React from 'react';
import qs from 'qs';
import { Provider } from 'mobx-react';
import { IntlProvider } from 'react-intl';

import { IWidgetSettings } from '@linkexchange/types/widget';
import { EWidgetSize } from '@linkexchange/types/widget';
import web3 from '@linkexchange/utils/web3';
import { WidgetSettings } from '@linkexchange/widget-settings';
import Web3Store from '@linkexchange/web3-store';
import Erc20 from '@linkexchange/web3-store/erc20';
import LinksStore from '@linkexchange/links-store';

import App from './App';
import BlocksStore from './stores/blocks';

import '../styles/all.scss';

const [, searchParams] = document.location.href.split('?');
const { startBlock, endBlock, ...widgetSettingsFromParams } = qs.parse(searchParams);

const BENTYN_CONFIG = {
  startBlock: parseInt(startBlock, 10) || 4884495,
  endBlock: parseInt(endBlock, 10) || 5357637,
};

const BENTYN_WIDGET_CONFIG: IWidgetSettings = {
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
  ...widgetSettingsFromParams,
};

const widgetSettingsStore = new WidgetSettings({ ...BENTYN_WIDGET_CONFIG, ...widgetSettingsFromParams });
const blocksStore = new BlocksStore(BENTYN_CONFIG.startBlock, BENTYN_CONFIG.endBlock);
const web3Store = new Web3Store(web3, Erc20, widgetSettingsStore);
const linksStore = new LinksStore(widgetSettingsStore);

render(
  <Provider
    blocks={blocksStore}
    links={linksStore}
    widgetSettingsStore={widgetSettingsStore}
    web3Store={web3Store}
    formValidationsStore={{ 'add-link': {} }}
  >
    <IntlProvider locale="en">
      <App />
    </IntlProvider>
  </Provider>,
  document.querySelector('.root'),
);
