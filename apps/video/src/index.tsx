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

const { blocks, widget } = parsedParams;

const store = getStore(widget, blocks);

const [network] = widget.asset.split(':');
const infuraWeb3 = getInfura(network as TNetwork);

render(
  <Provider store={store}>
    <Web3Provider injectedWeb3={web3} infuraWeb3={infuraWeb3}>
      <App />
    </Web3Provider>
  </Provider>,
  document.querySelector('.root'),
);
