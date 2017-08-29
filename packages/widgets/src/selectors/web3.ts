import { createSelector } from 'reselect';

import { IRootState } from '../ducks';

const web3State = ({ web3 }: IRootState) => web3;
const widgetSettings = ({ widget }: IRootState) => widget;

export const web3Enabled = createSelector(
  web3State,
  widgetSettings,
  (web3State, { context }) => {
    const [network] = context.split(':');

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
