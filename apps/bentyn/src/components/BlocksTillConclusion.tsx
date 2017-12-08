import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import moment from 'moment';

import core from '@userfeeds/core/src';
import wait from '@linkexchange/utils/wait';
import Web3StateProvider from '@linkexchange/web3-state-provider';
import { IWeb3State } from '@linkexchange/web3-state-provider/duck';

import Tooltip from '@linkexchange/components/src/Tooltip';

import { IBentynState } from '../ducks/bentyn';

import ProgressBar from './ProgressBar';

import * as style from './blocksTillConclusion.scss';

const cx = classnames.bind(style);

interface IProps {
  asset: string;
  web3: any;
  className?: string;
  startBlock: number;
  endBlock: number;
}

interface IState {
  average: number;
  loaded: boolean;
  blockNumber?: number;
}

export default class BlocksTillConclusion extends Component<IProps, IState> {

  state: IState = {
    average: 12,
    loaded: false,
  };

  componentDidMount() {
    this._load();
  }

  render() {
    return this.state.loaded ? this._renderComponent() : null;
  }

  _renderComponent = () => {
    const { startBlock, endBlock } = this.props;
    const { blockNumber } = this.state;
    // const disabled = !web3Enabled && (reason && reason !== 'Your wallet is locked');
    const disabled = false;

    let content: JSX.Element | null = null;
    if (startBlock > blockNumber!) {
      content = (
        <>
          <p>Auction will begin at block </p>
          <p>
            <span className={style.blockNumber}>{startBlock} </span>
            (est. {this._getEstimate(startBlock - blockNumber!)})
          </p>
        </>
      );
    } else if (endBlock > blockNumber!) {
      const progress = ((blockNumber! - startBlock) / (endBlock - startBlock) * 100).toFixed(2);
      content = (
        <>
          <p>Blocks till conclusion</p>
          <p>
            <span className={style.blockNumber}>{endBlock - blockNumber!} </span>
            (est. {this._getEstimate(endBlock - blockNumber!)})
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

  _load = async () => {
    const { web3, asset } = this.props;
    const [network] = asset.split(':');

    while (!(await web3.eth.net.isListening() || await core.utils.getCurrentNetworkName(web3) === network)) {
      wait(1000);
    }

    while (true) {
      const blockNumber = await core.utils.getBlockNumber(web3);
      this.setState({ loaded: true, blockNumber });
      this._getAverageBlockTime(blockNumber);
      await wait(this.state.average * 1000);
    }
  }

  _getEstimate = (blocks) => {
    return moment.duration(blocks * this.state.average * 1000).humanize();
  }

  _getAverageBlockTime = async (blockNumber) => {
    const SPAN = 100;
    const currentBlock = await core.utils.getBlock(this.props.web3, blockNumber);
    const pastBlock = await core.utils.getBlock(this.props.web3, blockNumber - SPAN);

    const average = (currentBlock.timestamp - pastBlock.timestamp) / 100;

    this.setState({ average });
  }
}
