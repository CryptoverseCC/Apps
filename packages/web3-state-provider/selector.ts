import { createSelector } from 'reselect';

import { IWeb3State } from './duck';

const web3State = ({ web3 }: { web3: IWeb3State }) => web3;
const network = (_, { network }: { network: string }) => network;

export const web3Enabled = createSelector(
  web3State,
  network,
  (web3State, network) => {
    return {
      enabled: web3State.available && web3State.unlocked && web3State.network === network,
      reason: getReason(web3State.available, web3State.unlocked, web3State.network === network, network),
    };
  },
);

const getReason = (available, unlocked, correctNetwork, desiredNetwork): undefined | string => {
  if (!available) {
    return 'Web3 is unavailable';
  } else if (!unlocked) {
    return 'Your wallet is locked';
  } else if (!correctNetwork) {
    return `You have to switch to ${desiredNetwork} network`;
  }
};
