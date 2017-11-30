import React, { Component } from 'react';
import { connect } from 'react-redux';

import web3 from '@linkexchange/utils/web3';
import Web3StateProvider from '@linkexchange/web3-state-provider';
import { IWeb3State } from '@linkexchange/web3-state-provider/duck';

import { IBentynState } from '../ducks/bentyn';

interface IProps {
  asset: string;
  render(state: { enabled: boolean, reason?: string }): JSX.Element;
  blockNumber: number;
  startBlock: number;
  endBlock: number;
}

class BlocksTillConclusionProvider extends Component<IProps, {}> {

  render() {
    const [desiredNetwork] = this.props.asset.split(':');

    return (
      <Web3StateProvider
        desiredNetwork={desiredNetwork}
        render={this._renderComponent}
      />
    );
  }

  _renderComponent = ({ enabled, reason }) => {
    const { render, blockNumber, startBlock, endBlock } = this.props;

    if (!enabled) {
      return render({ enabled, reason });
    } else if (startBlock > blockNumber) {
      return render({ enabled: false, reason: `The auction hasn't begun yet` });
    } else if (endBlock > blockNumber) {
      return render({ enabled: true });
    } else {
      return render({ enabled: false, reason: 'The auction is closed' });
    }
  }
}

const mapStateToProps = ({ web3, bentyn }: { web3: IWeb3State, bentyn: IBentynState }) => ({
  blockNumber: web3.blockNumber,
  startBlock: bentyn.startBlock,
  endBlock: bentyn.endBlock,
});

export default connect(mapStateToProps)(BlocksTillConclusionProvider);
