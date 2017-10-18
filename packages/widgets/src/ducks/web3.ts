import { actionCreatorFactory, isType } from 'typescript-fsa';
import { Action } from 'redux';
import * as isEqual from 'lodash/isEqual';

import core from '@userfeeds/core/src';
import web3 from '@userfeeds/utils/src/web3';

import { IRootState } from './';

const acf = actionCreatorFactory('web3');

export const web3Actions = {
  updateAvailability: acf<{
    available: boolean;
    unlocked: boolean;
    network?: string;
  }>('UPDATE_AVAILABILITY'),
};

export const observeInjectedWeb3 = () => (dispatch, getState: () => IRootState) => {
  const check = () => {
    web3.eth.getAccounts(async (error, accounts = []) => {
      const networkName = await core.utils.getCurrentNetworkName(web3);
      const currentState = {
        available: !!web3.isConnected(),
        unlocked: accounts.length > 0,
        network: networkName,
      };

      const { web3: lastState } = getState();

      if (!isEqual(currentState, lastState)) {
        dispatch(web3Actions.updateAvailability(currentState));
      }
    });
  };

  setInterval(check, 1000);
};

export interface IWeb3State {
  available: boolean;
  unlocked: boolean;
  network?: string;
}

const initialState: IWeb3State = {
  available: false,
  unlocked: false,
};

export default function web3Reducer(state: IWeb3State = initialState, action: Action) {
  if (isType(action, web3Actions.updateAvailability)) {
    return action.payload;
  }

  return state;
}
