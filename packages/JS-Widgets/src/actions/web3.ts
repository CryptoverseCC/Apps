import { actionCreatorFactory } from 'typescript-fsa';
import * as core from '@userfeeds/core';
import * as isEqual from 'lodash/isEqual';

import { IRootState } from '../reducers';

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
    const currentState = {
      available: !!window.web3, // web3.currentProvider.isMetaMask
      unlocked: !!window.web3 && web3.eth.accounts.length > 0,
      network: window.web3 ? core.utils.getCurrentNetworkName() : undefined,
    };

    const { web3: lastState } = getState();

    if (!isEqual(currentState, lastState)) {
      dispatch(web3Actions.updateAvailability(currentState));
    }
  };

  setInterval(check, 1000);
};
