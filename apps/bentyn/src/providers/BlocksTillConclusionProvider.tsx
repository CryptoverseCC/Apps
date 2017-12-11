import React, { Component } from 'react';
import Web3 from 'web3';

import core from '@userfeeds/core/src';
import wait from '@linkexchange/utils/wait';
import { withInjectedWeb3AndWeb3State } from '@linkexchange/web3-state-provider';

interface IProps {
  web3: Web3;
  web3State: {
    enabled: boolean;
    reason?: string;
  };
  asset: string;
  startBlock: number;
  endBlock: number;
  render(state: { enabled: boolean; reason?: string; }): JSX.Element;
}

interface IState {
  loaded: boolean;
  blocksState?: {
    enabled: boolean;
    reason?: string;
  };
}

const HASNT_STARTED = `The auction hasn't begun yet`;
const IS_CLOSED = 'The auction is closed';

class BlocksTillConclusionProvider extends Component<IProps, IState> {

  static reasons = {
    HASNT_STARTED,
    IS_CLOSED,
  };

  state: IState = {
    loaded: false,
  };

  componentDidMount() {
    const { web3, asset, startBlock, endBlock } = this.props;
    load(web3, asset, startBlock, endBlock, this._onUpdate);
  }

  render() {
    const { web3State } = this.props;
    const { loaded, blocksState } = this.state;

    if (loaded && !blocksState!.enabled) {
      return this.props.render(blocksState!);
    } else if (!web3State.enabled || !loaded) {
      return this.props.render(web3State);
    }

    return this.props.render(blocksState!);
  }

  _onUpdate = (blocksState) => {
    this.setState({ loaded: true, blocksState });
  }
}

export default withInjectedWeb3AndWeb3State(BlocksTillConclusionProvider);

const load = async (web3, asset, startBlock, endBlock, update) => {
  const [network] = asset.split(':');

  while (!(
    web3.currentProvider !== null
    && await web3.eth.net.isListening()
    && await core.utils.getCurrentNetworkName(web3) === network)) {
    await wait(1000);
  }

  while (true) {
    const blockNumber = await core.utils.getBlockNumber(web3);

    if (startBlock > blockNumber) {
      update({ enabled: false, reason: HASNT_STARTED });
    } else if (endBlock > blockNumber) {
      update({ enabled: true });
    } else {
      update({ enabled: false, reason: IS_CLOSED });
    }
    await wait(10 * 1000);
  }
};
