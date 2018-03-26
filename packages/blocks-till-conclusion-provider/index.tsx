import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Web3Store from '@linkexchange/web3-store';

interface IProps {
  web3Store?: Web3Store;
  blocks?: any; // ToDo
  render(state: { enabled: boolean; reason?: string }): JSX.Element;
}

const HASNT_STARTED = `The auction hasn't begun yet`;
const IS_CLOSED = 'The auction is closed';

class BlocksTillConclusionProvider extends Component<IProps> {
  static reasons = {
    HASNT_STARTED,
    IS_CLOSED,
  };

  render() {
    const { blocks } = this.props;
    const web3Store: any = this.props.web3Store; // ToDo

    if (web3Store.reason) {
      return this.props.render({
        enabled: false,
        reason: web3Store.reason,
      });
    }

    if (web3Store.blockNumber > blocks.endBlock) {
      return this.props.render({
        enabled: false,
        reason: IS_CLOSED,
      });
    }

    if (web3Store.blockNumber < blocks.startBlock) {
      return this.props.render({
        enabled: false,
        reason: HASNT_STARTED,
      });
    }

    return this.props.render({ enabled: true });
  }
}

export default inject('web3Store', 'blocks')(observer(BlocksTillConclusionProvider));
