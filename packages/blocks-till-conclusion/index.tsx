import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classnames from 'classnames/bind';
import moment from 'moment';
import Web3 from 'web3';

import core from '@userfeeds/core/src';
import wait from '@linkexchange/utils/wait';
import Web3Store from '@linkexchange/web3-store';
import { getAverageBlockTime } from '@linkexchange/utils/ethereum';
import Tooltip from '@linkexchange/components/src/Tooltip';
import ProgressBar from '@linkexchange/components/src/ProgressBar';

import * as style from './blocksTillConclusion.scss';

const cx = classnames.bind(style);

interface IProps {
  className?: string;
  startBlock: number;
  endBlock: number;
  web3Store?: Web3Store;
}

const DEFAULT_AVERAGE_TIME = 12;

class BlocksTillConclusion extends Component<IProps> {
  render() {
    const { startBlock, endBlock } = this.props;
    const { blockNumber } = this.props.web3Store!;

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
      content = <p>Auction is closed</p>;
    }

    return <div className={cx(style.self, this.props.className)}>{content}</div>;
  }

  _getEstimate = (blocks) => {
    // return moment.duration(blocks * this.state.average * 1000).humanize();
    return moment.duration(blocks * DEFAULT_AVERAGE_TIME * 1000).humanize(); // TODO!
  };
}

export default inject('web3Store')(observer(BlocksTillConclusion));
