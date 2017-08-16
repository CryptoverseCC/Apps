import { actionCreatorFactory } from 'typescript-fsa';
import * as core from '@userfeeds/core';
import * as isEqual from 'lodash/isEqual';

import { IRootState } from '../reducers';

import web3 from '../utils/web3';

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
