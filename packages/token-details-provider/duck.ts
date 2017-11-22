import { actionCreatorFactory, isType } from 'typescript-fsa';
import { Action } from 'redux';
import * as isEqual from 'lodash/isEqual';

import core from '@userfeeds/core/src';
import web3 from '@linkexchange/utils/web3';
import wait from '@linkexchange/utils/wait';

const {
  erc20ContractDecimals,
  erc20ContractBalance,
  erc20ContractSymbol,
  erc20ContractName,
} = core.ethereum.erc20;

const acf = actionCreatorFactory('web3');

export const tokenDetailsActions = {
  tokenDetailsLoaded: acf<ITokenDetailsState>('TOKEN_DETAILS_LOADED'),
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

  dispatch(tokenDetailsActions.tokenDetailsLoaded({
    loaded: true,
    decimals: decimals.toString(),
    balance: balance.toString(),
    symbol,
    name,
  }));
};

export interface ITokenDetailsState {
  loaded: boolean;
  decimals: any | null;
  balance?: any;
  balanceWithDecimalPoint?: any;
  symbol?: string;
  name?: string;
}

const initialState: ITokenDetailsState = {
  loaded: false,
  decimals: 18,
};

export default function tokenDetails(state: ITokenDetailsState = initialState, action: Action) {
  if (isType(action, tokenDetailsActions.tokenDetailsLoaded)) {
    return { ...state, tokenDetails: action.payload };
  }

  return state;
}
