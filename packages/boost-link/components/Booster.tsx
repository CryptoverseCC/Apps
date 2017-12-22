import React, { Component, ChangeEvent } from 'react';
import classnames from 'classnames';
import BigNumber from 'bignumber.js';

import Icon from '@linkexchange/components/src/Icon';
import { IRemoteLink } from '@linkexchange/types/link';
import { ITokenDetails } from '@linkexchange/token-details-provider';
import { fromWeiToString, toWei } from '@linkexchange/utils/balance';

import Slider from './Slider';

import * as style from './booster.scss';

interface IProps {
  link: IRemoteLink;
  links: IRemoteLink[];
  tokenDetails: ITokenDetails;
  onSend(toPay: string): void;
}

interface IState {
  sum: BigNumber;
  toPay: string;
  possitionInRanking: number;
  hasInsufficientFunds: boolean;
  probability: number | null;
}

export default class Booster extends Component<IProps, IState> {

  state = {
    toPay: '0',
    possitionInRanking: this.props.links.indexOf(this.props.link),
    hasInsufficientFunds: false,
    sum: this.props.links.reduce((acc, { score }) => acc.add(score.toFixed(0)), new BigNumber(0)),
    probability: null,
  };

  render() {
    const { tokenDetails, link } = this.props;
    const { toPay, probability, possitionInRanking, hasInsufficientFunds } = this.state;

    return (
      <>
        <div className={style.header}>
          <div className={style.positionContainer}>
            <div className={style.position}>{possitionInRanking + 1}</div>
            <span className={style.label}>In Slot</span>
          </div>
          <p className={style.balance}>
            Your balance:
            <span className={style.amount}>{tokenDetails.balanceWithDecimalPoint} {tokenDetails.symbol}</span>
          </p>
        </div>
        <div className={style.separator} />
        <div className={style.insufficientFundsContainer}>
          {hasInsufficientFunds && <span className={style.insufficientFunds}>Insufficient funds</span>}
        </div>
        <div className={style.probabilities}>
          <p className={classnames(style.probability, style.currentProbability)}>{`${link.probability} %`}</p>
          <p className={style.dash}>&mdash;</p>
          <p className={style.probability}>{`${probability === null ? '-' : probability.toFixed(1)} %`}</p>
        </div>
        <Slider
          className={style.slider}
          initialValue={link.probability}
          value={probability}
          onChange={this._onSliderChange}
        />
        <div className={style.footer}>
          <input
            type="text"
            className={style.toPay}
            value={toPay}
            onChange={this._onInputChange}
          />
          <div className={style.next} onClick={this._onSendClick}>
            <Icon name="arrow-right" className={style.icon}/>
          </div>
        </div>
      </>
    );
  }

  _onSendClick = () => this.props.onSend(this.state.toPay);

  _onSliderChange = (newProbability: number) => {
    const { link, links, tokenDetails } = this.props;
    const { sum } = this.state;

    const toPayWei = new BigNumber(100).mul(link.score.toFixed(0)).sub(sum.mul(newProbability))
        .div((newProbability - 100).toFixed(1)).truncated();

    const toPay = fromWeiToString(toPayWei.toString(), tokenDetails.decimals, parseInt(tokenDetails.decimals, 10));
    const possitionInRanking = this._getLinkPosition(toPayWei, link, links);

    if (toPayWei.gt(this.props.tokenDetails.balance)) {
      this.setState({ toPay, possitionInRanking, probability: newProbability, hasInsufficientFunds: true });
    } else {
      this.setState({ toPay, possitionInRanking, probability: newProbability, hasInsufficientFunds: false });
    }
  }

  _onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { link, links, tokenDetails } = this.props;
    const { sum } = this.state;

    const toPay = e.target.value;
    const toPayWei = new BigNumber(toWei(toPay, tokenDetails.decimals));
    const probability = new BigNumber(toPayWei).add(link.score.toFixed(0))
      .div(sum.add(toPayWei)).mul(1000).round().div(10).toNumber();

    const possitionInRanking = this._getLinkPosition(toPayWei, link, links);

    if (toPayWei.gt(this.props.tokenDetails.balance)) {
      this.setState({ toPay, probability, possitionInRanking, hasInsufficientFunds: true });
    } else {
      this.setState({ toPay, probability, possitionInRanking, hasInsufficientFunds: false });
    }
  }

  _getLinkPosition = (boostBy: BigNumber, link: IRemoteLink, links: IRemoteLink[]) => {
    const linkTotalScore = boostBy.add(link.score.toFixed(0));
    const positionInRanking = links
      .map((l) => l === link ? linkTotalScore : new BigNumber(l.score.toFixed(0)))
      .sort((a, b) => b.comparedTo(a))
      .indexOf(linkTotalScore);

    return positionInRanking >= 0 ? positionInRanking : null;
  }
}
