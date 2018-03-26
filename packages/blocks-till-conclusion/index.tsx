import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classnames from 'classnames/bind';
import moment from 'moment';

import Web3Store from '@linkexchange/web3-store';
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
      const estimate = this.getEstimate(startBlock - blockNumber!);
      content = (
        <span>
          Auction will begin in <span style={{ color: getColor(-estimate.valueOf()) }}>{estimate.humanize()}</span>
          <span className={style.blockInfo}> (after {startBlock - blockNumber!} blocks)</span>
        </span>
      );
    } else if (endBlock > blockNumber!) {
      const estimate = this.getEstimate(endBlock - blockNumber!);
      const progress = ((blockNumber! - startBlock) / (endBlock - startBlock) * 100).toFixed(2);
      content = (
        <>
          <span>
            Expires in <span style={{ color: getColor(estimate.valueOf()) }}>{estimate.humanize()}</span>{' '}
            <span className={style.blockInfo}>(in {endBlock - blockNumber!} blocks)</span>
          </span>
          <ProgressBar
            progress={progress}
            className={style.progressBar}
            fillStyle={{ backgroundColor: getColor(estimate, '#263FFF') }}
          />
        </>
      );
    } else {
      content = <span style={{ color: '#fb0035' }}>Auction is closed</span>;
    }

    return <div className={cx(style.self, this.props.className)}>{content}</div>;
  }

  private getEstimate = (blocks) => {
    // return moment.duration(blocks * this.state.average * 1000).humanize();
    return moment.duration(blocks * DEFAULT_AVERAGE_TIME * 1000);
  };
}

const getColor = (expiresIn, defaultColor = '#09d57c') => {
  if (expiresIn < 0) {
    if (expiresIn > -moment.duration({ days: 3 }).valueOf()) {
      return defaultColor;
    }
    if (expiresIn > -moment.duration({ weeks: 1 }).valueOf()) {
      return '#ebeb00';
    }
    return '#fb0035';
  }
  if (expiresIn < moment.duration({ days: 3 })) {
    return '#fb0035';
  }
  if (expiresIn < moment.duration({ weeks: 1 })) {
    return '#ebeb00';
  }

  return defaultColor;
};

export default inject('web3Store')(observer(BlocksTillConclusion));
