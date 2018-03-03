import React, { Component } from 'react';
import * as isEqual from 'lodash/isEqual';
import flowRight from 'lodash/flowRight';
import Web3 from 'web3';

import core from '@userfeeds/core/src';
import wait from '@linkexchange/utils/wait';
import Web3TaskRunner from '@linkexchange/utils/web3TaskRunner';
import { Omit, Diff } from '@linkexchange/types';
import { withInjectedWeb3 } from '@linkexchange/utils/web3';

export interface IWeb3State {
  enabled: boolean;
  reason?: string;
  currentBlockNumber?: number;
}

interface IProps {
  web3: Web3;
  asset?: string;
  render(web3State: IWeb3State): any;
}

interface IState {
  web3State: IWeb3State;
}

export default class Web3StateProvider extends Component<IProps, IState> {
  removeListener: () => void;
  state: IState = {
    web3State: {
      enabled: false,
    },
  };

  componentDidMount() {
    this.removeListener = taskRunner.run(this.props.web3, [this.props.asset || ''], (web3State) => {
      this.setState({ web3State });
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    return this.props.render(this.state.web3State);
  }
}

export const Web3StateProviderWithInjectedWeb3 = withInjectedWeb3(Web3StateProvider);

interface IComponentProps {
  web3State: IWeb3State;
}

export const withWeb3State = <T extends IComponentProps>(Cmp: React.ComponentType<T>) => {
  return class extends Component<
    Omit<T, keyof IComponentProps> & {
      web3: Web3;
      asset?: string;
    },
    IState
  > {
    static displayName = `withWeb3State(${Cmp.displayName || Cmp.name})`;
    removeListener: () => void;
    state: IState = {
      web3State: {
        enabled: false,
      },
    };

    componentDidMount() {
      this.removeListener = taskRunner.run(
        this.props.web3,
        [typeof this.props.asset === 'string' ? this.props.asset : ''],
        (web3State) => {
          this.setState({ web3State });
        },
      );
    }

    componentWillUnmount() {
      this.removeListener();
    }

    render() {
      return <Cmp web3State={this.state.web3State} {...this.props} />;
    }
  };
};

export const withInjectedWeb3AndWeb3State = flowRight(withInjectedWeb3, withWeb3State);

const load = async (web3, [asset = ''], update) => {
  const [network] = asset.split(':');

  while (true) {
    if (!web3.currentProvider) {
      update({ enabled: false, reason: 'Install Metamask to unlock all the features' });
    } else if (!(web3.currentProvider !== null && (await web3.eth.net.isListening()))) {
      update({ enabled: false, reason: 'Enable Metamask to unlock all the features' });
    } else if ((await web3.eth.getAccounts()).length === 0) {
      update({ enabled: false, reason: 'Unlock your wallet to unlock all the features' });
    } else if (!!network && (await core.utils.getCurrentNetworkName(web3)) !== network) {
      update({ enabled: false, reason: `Switch to ${network} network to unlock all the features` });
    } else {
      update({ enabled: true, currentBlockNumber: await core.utils.getBlockNumber(web3) });
    }
    await wait(1000);
  }
};

const taskRunner = new Web3TaskRunner<IWeb3State, [string]>(load);
