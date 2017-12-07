import React, { Component } from 'react';

import wait from '@linkexchange/utils/wait';
import core from '@userfeeds/core/src';

interface IProps {
  asset: string;
  startBlock: number;
  endBlock: number;
  render(state: { enabled: boolean, reason?: string }): JSX.Element;
  web3?: any; // ToDo type here
}

interface IState {
  loaded: boolean;
  enabled?: boolean;
  data?: string | number;
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

  _onUpdate = ({ enabled, data }) => {
    this.setState({ loaded: true, enabled, data });
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
      update({ enabled: false, data: HASNT_STARTED });
    } else if (endBlock > blockNumber) {
      update({ enabled: true, data: (blockNumber - startBlock) / (endBlock - startBlock) * 100 });
    } else {
      update({ enabled: false, data: IS_CLOSED });
    }
    await wait(10 * 1000);
  }
};
