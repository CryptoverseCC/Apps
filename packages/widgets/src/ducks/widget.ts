import { actionCreatorFactory, isType } from 'typescript-fsa';
import { Action } from 'redux';

import { EWidgetSize } from '../types';
import { IRootState } from './';

import core from '@userfeeds/core/src';
import { fetchLinks } from './links';
import web3 from '@userfeeds/utils/src/web3';
import wait from '@userfeeds/utils/src/wait';

const {
  erc20ContractDecimals,
  erc20ContractBalance,
  erc20ContractSymbol,
  erc20ContractName,
} = core.ethereum.erc20;

const acf = actionCreatorFactory('widget');

export const widgetActions = {
  update: acf<Partial<IWidgetState>>('UPDATE'),
  tokenDetailsLoaded: acf<ITokenDetailsState>('TOKEN_DETAILS_LOADED'),
};

export const updateWidgetSettings = (newSettings: Partial<IWidgetState>) => (dispatch, getState: () => IRootState) => {
  const { widget: oldSettings } = getState();
  dispatch(widgetActions.update(newSettings));

  if (newSettings.recipientAddress !== oldSettings.recipientAddress
    || newSettings.asset !== oldSettings.asset
    || newSettings.whitelist !== oldSettings.whitelist
    || newSettings.algorithm !== oldSettings.algorithm) {
    dispatch(fetchLinks());
  }
};

export const loadTokenDetails = () => async (dispatch, getState: () => IRootState) => {
  const { widget } = getState();
  const token = widget.asset.split(':')[1];
  if (!token) {
    return;
  }

  let { web3: web3State } = getState();
  while (!web3State.available) {
    await wait(1000);
    web3State = getState().web3;
  }

  const [decimals, balance, symbol, name] = await Promise.all([
    erc20ContractDecimals(web3, token),
    erc20ContractBalance(web3, token),
    erc20ContractSymbol(web3, token),
    erc20ContractName(web3, token),
  ]);

  dispatch(widgetActions.tokenDetailsLoaded({ loaded: true, decimals, balance, symbol, name }));
};

export interface ITokenDetailsState {
  loaded: boolean;
  decimals: any | null;
  balance?: any;
  balanceWithDecimalPoint?: any;
  symbol?: string;
  name?: string;
}

export interface IWidgetState {
  apiUrl: string;
  recipientAddress: string;
  asset: string;
  algorithm: string;
  size: EWidgetSize;
  whitelist?: string;
  slots: number;
  timeslot: number;
  contactMethod?: string;
  publisherNote?: string;
  title?: string;
  description?: string;
  impression?: string;
  location?: string;
  tillDate?: string;
  tokenDetails: ITokenDetailsState;
}

const initialState = {
  apiUrl: 'https://api.userfeeds.io',
  recipientAddress: '0x0',
  asset: 'rinkeby',
  algorithm: 'links',
  size: EWidgetSize.rectangle,
  slots: 10,
  timeslot: 5,
  tokenDetails: {
    loaded: false,
    decimals: 18,
  },
};

export default function widget(state: IWidgetState = initialState, action: Action): IWidgetState {
  if (isType(action, widgetActions.update)) {
    return { ...state, ...action.payload };
  } else if (isType(action, widgetActions.tokenDetailsLoaded)) {
    return { ...state, tokenDetails: action.payload };
  }
  return state;
}
