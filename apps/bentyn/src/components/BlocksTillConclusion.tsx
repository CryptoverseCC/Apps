import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import moment from 'moment';

import core from '@userfeeds/core/src';
import web3 from '@linkexchange/utils/web3';
import Web3StateProvider from '@linkexchange/web3-state-provider';
import { IWeb3State } from '@linkexchange/web3-state-provider/duck';

import Tooltip from '@linkexchange/components/src/Tooltip';

import { IBentynState } from '../ducks/bentyn';

import ProgressBar from './ProgressBar';

import * as style from './blocksTillConclusion.scss';

const cx = classnames.bind(style);

interface IProps {
  asset: string;
  className?: string;
  blockNumber: number;
  startBlock: number;
  endBlock: number;
}

interface IState {
  average: number;
}

class BlocksTillConclusion extends Component<IProps, IState> {

  state = {
    average: 12,
  };

  render() {
    const { asset } = this.props;
    const [desiredNetwork] = asset.split(':');

    return (
      <Web3StateProvider
        desiredNetwork={desiredNetwork}
        render={this._renderComponent}
      />
    );
  }

  _renderComponent = ({ enabled: web3Enabled, reason }: { enabled: boolean, reason?: string }) => {
    // ToDo it's not the best place for this.
    if (web3Enabled) {
      this._getAverageBlockTime();
    }
    const { blockNumber, startBlock, endBlock } = this.props;
    const disabled = !web3Enabled && (reason && reason !== 'Your wallet is locked');

    let content = null;
    if (disabled) {
      content = (
        <Tooltip text={reason}>
          <p>Block till start/conclusion</p>
        </Tooltip>
      );
    } else if (startBlock > blockNumber) {
      content = (
        <>
          <p>Auction will begin at block </p>
          <p>
            <span className={style.blockNumber}>{startBlock} </span>
            (est. {this._getEstimate(startBlock - blockNumber)})
          </p>
        </>
      );
    } else if (endBlock > blockNumber) {
      const progress = ((blockNumber - startBlock) / (endBlock - startBlock) * 100).toFixed(2);
      content = (
        <>
          <p>Blocks till conclusion</p>
          <p>
            <span className={style.blockNumber}>{endBlock - blockNumber} </span>
            (est. {this._getEstimate(endBlock - blockNumber)})
          </p>
          <Tooltip text={`${progress}%`}>
            <ProgressBar progress={progress} className={style.progressBar} />
          </Tooltip>
        </>
      );
    } else {
      content = (
        <p>Auction is closed</p>
      );
    }

    return (
      <div className={cx(style.self, { disabled }, this.props.className)}>
        {content}
      </div>
    );
  }

  _getEstimate = (blocks) => {
    return moment.duration(blocks * this.state.average * 1000).humanize();
  }

  _getAverageBlockTime = async () => {
    const SPAN = 100;
    const currentBlock = await core.utils.getBlock(web3, this.props.blockNumber);
    const pastBlock = await core.utils.getBlock(web3, this.props.blockNumber - SPAN);

    const average = (currentBlock.timestamp - pastBlock.timestamp) / 100;

    this.setState({ average });
  }
}

const mapStateToProps = ({ web3, bentyn }: { web3: IWeb3State, bentyn: IBentynState }) => ({
  blockNumber: web3.blockNumber,
  startBlock: bentyn.startBlock,
  endBlock: bentyn.endBlock,
});

export default connect(mapStateToProps)(BlocksTillConclusion);
