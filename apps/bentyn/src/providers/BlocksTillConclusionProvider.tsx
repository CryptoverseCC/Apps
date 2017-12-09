import React, { Component } from 'react';
import Web3 from 'web3';

import wait from '@linkexchange/utils/wait';
import core from '@userfeeds/core/src';

interface IProps {
  web3: Web3;
  asset: string;
  startBlock: number;
  endBlock: number;
  render(state: IState): JSX.Element;
}

interface IState {
  loaded: boolean;
  enabled?: boolean;
  reason?: string;
  data?: string |number;
}

const HASNT_STARTED = `The auction hasn't begun yet`;
const IS_CLOSED = 'The auction is closed';

export default class BlocksTillConclusionProvider extends Component<IProps, IState> {

  static reasons = {
    HASNT_STARTED,
    IS_CLOSED,
  };

  state = {
    loaded: false,
  };

  componentDidMount() {
    const { web3, asset, startBlock, endBlock } = this.props;
    load(web3, asset, startBlock, endBlock, this._onUpdate);
  }

  render() {
    return this.state.loaded ? this.props.render(this.state) : null;
  }

  _onUpdate = (state) => {
    this.setState({ loaded: true, ...state });
  }
}

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
      update({ enabled: true, reason: (blockNumber - startBlock) / (endBlock - startBlock) * 100 });
    } else {
      update({ enabled: false, data: IS_CLOSED });
    }
    await wait(10 * 1000);
  }
};
