import { render } from 'react-dom';
import React from 'react';
import qs from 'qs';
import { Provider } from 'mobx-react';
import { IntlProvider } from 'react-intl';

import { IWidgetSettings } from '@linkexchange/types/widget';
import { WidgetSettingsProvider } from '@linkexchange/widget-settings';
import { EWidgetSize } from '@linkexchange/types/widget';
import web3, { getInfura, Web3Provider, TNetwork } from '@linkexchange/utils/web3';

import App from './App';
import BlocksStore from './stores/blocks';

import '../styles/all.scss';

const [, searchParams] = document.location.href.split('?');
const { startBlock, endBlock, ...widgetSettingsFromParams } = qs.parse(searchParams);

const BENTYN_CONFIG = {
  startBlock: parseInt(startBlock, 10) || 4884495,
  endBlock: parseInt(endBlock, 10) || 5172495,
};

const BENTYN_WIDGET_CONFIG: IWidgetSettings = {
  apiUrl: 'https://api-staging.userfeeds.io',
  recipientAddress: '0xD7Bad27E6B797952382860C581A7E4c90BeA5Deb',
  whitelist: '0xD7Bad27E6B797952382860C581A7E4c90BeA5Deb',
  asset: 'ethereum:0x108c05cac356d93b351375434101cfd3e14f7e44',
  algorithm: `betweenblocks;minBlockNumber=${BENTYN_CONFIG.startBlock};maxBlockNumber=${BENTYN_CONFIG.endBlock}`,
  size: 'leaderboard' as EWidgetSize,
  slots: 5,
  timeslot: 5,
  contactMethod: 'ben@userfeeds.io',
  title: '',
  description: '',
  impression: '',
  location: window.location.href,
  minimalLinkFee: '1',
  ...widgetSettingsFromParams,
};

const widgetSettings: IWidgetSettings = { ...BENTYN_WIDGET_CONFIG, ...widgetSettingsFromParams };
const blocksStore = new BlocksStore(BENTYN_CONFIG.startBlock, BENTYN_CONFIG.endBlock);

const [network] = BENTYN_WIDGET_CONFIG.asset.split(':');
const infuraWeb3 = getInfura(network as TNetwork);

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
