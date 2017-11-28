import { actionCreatorFactory, isType } from 'typescript-fsa';
import { Action } from 'redux';
import * as isEqual from 'lodash/isEqual';

import core from '@userfeeds/core/src';
import web3 from '@linkexchange/utils/web3';

const acf = actionCreatorFactory('web3');

export const web3Actions = {
  updateState: acf<{
    available: boolean;
    unlocked: boolean;
    network?: string;
    blockNumber?: number;
  }>('UPDATE_STATE'),
};

const intervalsMaps = new Map<() => any, number>();

export const observeInjectedWeb3 = () => (dispatch, getState: () => { web3: IWeb3State }) => {
  const check = () => {
    web3.eth.getAccounts(async (error, accounts = []) => {
      const available = !!web3.isConnected();
      let networkName;
      let blockNumber;
      if (available) {
        networkName = await core.utils.getCurrentNetworkName(web3);
        blockNumber = await core.utils.getBlockNumber(web3);
      }

      const currentState = {
        available,
        blockNumber,
        unlocked: accounts.length > 0,
        network: networkName,
      };

      const { web3: lastState } = getState();

      if (!isEqual(currentState, lastState)) {
        dispatch(web3Actions.updateState(currentState));
      }
    });
  };

  if (!intervalsMaps.has(dispatch)) {
    intervalsMaps.set(dispatch, window.setInterval(check, 1000));
  }
};

export interface IWeb3State {
  available: boolean;
  unlocked: boolean;
  network?: string;
  blockNumber?: number;
}

const initialState: IWeb3State = {
  available: false,
  unlocked: false,
};

export default function web3Reducer(state: IWeb3State = initialState, action: Action) {
  if (isType(action, web3Actions.updateState)) {
    return action.payload;
  }

  return state;
}
