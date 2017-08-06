import { actionCreatorFactory } from 'typescript-fsa';
import * as core from '@userfeeds/core';

const acf = actionCreatorFactory('web3');

export const web3Actions = {
  updateAvailability: acf<{
    available: boolean;
    unlocked: boolean;
    network?: string;
  }>('UPDATE_AVAILABILITY'),
};

export const observeInjectedWeb3 = () => (dispatch) => {
  const check = () => {
    dispatch(web3Actions.updateAvailability({
      available: !!web3, // web3.currentProvider.isMetaMask
      unlocked: !!web3 && web3.eth.accounts.length > 0,
      network: web3 ? core.utils.getCurrentNetworkName() : undefined,
    }));
  };

  check();
  setInterval(check, 1000);
};
