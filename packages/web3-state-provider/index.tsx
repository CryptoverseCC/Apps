import React, { Component } from 'react';
import * as isEqual from 'lodash/isEqual';

import wait from '@linkexchange/utils/wait';
import core from '@userfeeds/core/src';

import { web3Enabled } from './selector';
import { observeInjectedWeb3 } from './duck';

interface IWeb3State {
  enabled: boolean;
  reason?: string;
}

interface IProps {
  web3: any; // ToDo type
  asset: string;
  synchronizeState(): any;
  render(web3State: IWeb3State): any;
}

interface IState {
  web3State: IWeb3State;
}

export default class Web3StateProviderComponent extends Component<IProps, IState> {
  state: IState = {
    web3State: {
      enabled: false,
    },
  };

  componentDidMount() {
    load(this.props.web3, this.props.asset, (web3State) => {
      this.setState({ web3State });
    });
  }

  render() {
    return this.props.render(this.state.web3State);
  }
}

const load = async (web3, asset, update) => {
  const [network] = asset.split(':');

  while (true) {
    if (!(web3.currentProvider !== null && await web3.eth.net.isListening())) {
      update({ enabled: false, reason: 'Web3 is unavailable' });
    } else if (await core.utils.getCurrentNetworkName(web3) !== network) {
      update({ enabled: false, reason: `You have to switch to ${network} network`});
    } else if ((await web3.eth.getAccounts()).length === 0) {
      update({ enabled: false, reason: 'Your wallet is locked' });
    } else {
      update({ enabled: true });
    }
    await wait(1000);
  }
};
