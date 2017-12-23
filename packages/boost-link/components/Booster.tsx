import React, { Component, ChangeEvent } from 'react';
import classnames from 'classnames/bind';
import BigNumber from 'bignumber.js';

import Icon from '@linkexchange/components/src/Icon';
import { IRemoteLink } from '@linkexchange/types/link';
import { R, validate } from '@linkexchange/utils/validation';
import { ITokenDetails } from '@linkexchange/token-details-provider';
import { fromWeiToString, toWei } from '@linkexchange/utils/balance';

import Slider from './Slider';

import * as style from './booster.scss';
const cx = classnames.bind(style);

interface IProps {
  link: IRemoteLink;
  linksInSlots: IRemoteLink[];
  tokenDetails: ITokenDetails;
  onSend(toPay: string): void;
}

interface IState {
  isInSlots: boolean;
  sum: BigNumber;
  toPay: string;
  inputError?: string;
  positionInRanking: number | null;
  hasInsufficientFunds: boolean;
  probability: number | null;
}

export default class Booster extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    const positionInRanking = this.props.linksInSlots.findIndex((l) => l.id === this.props.link.id);
    this.state = {
      isInSlots: positionInRanking >= 0,
      toPay: '0',
      positionInRanking: positionInRanking >= 0 ? positionInRanking : null,
      hasInsufficientFunds: false,
      sum: this.props.linksInSlots.reduce((acc, { score }) => acc.add(score.toFixed(0)), new BigNumber(0)),
      probability: null,
    };
  }
  render() {
    const { tokenDetails, link } = this.props;
    const { isInSlots, inputError, toPay, probability, positionInRanking, hasInsufficientFunds } = this.state;

    return (
      <>
        <div className={style.header}>
          <div className={style.positionContainer}>
            {positionInRanking !== null && <div className={style.position}>{positionInRanking + 1}</div>}
            <span className={style.label}>{positionInRanking !== null ? 'In Slot' : 'Approved'}</span>
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
        {isInSlots && (
          <>
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
          </>
        )}
        <div className={style.footer}>
          <div className={style.toPay}>
            <input
              type="text"
              className={style.input}
              value={toPay}
              onChange={this._onInputChange}
            />
            <span className={style.error}>{inputError}</span>
          </div>
          <div
            className={cx(style.next, { disabled: !!inputError || hasInsufficientFunds })}
            onClick={this._onSendClick}
          >
            <Icon name="arrow-right" className={style.icon}/>
          </div>
        </div>
      </>
    );
  }

  _onSendClick = () => {
    const { inputError, hasInsufficientFunds } = this.state;
    if (!!inputError || hasInsufficientFunds) {
      return;
    }

    this.props.onSend(this.state.toPay);
  }

  _onSliderChange = (newProbability: number) => {
    const { link, linksInSlots, tokenDetails } = this.props;
    const { sum } = this.state;

    const toPayWei = new BigNumber(100).mul(link.score.toFixed(0)).sub(sum.mul(newProbability))
        .div((newProbability - 100).toFixed(1)).truncated();

    const toPay = fromWeiToString(toPayWei.toString(), tokenDetails.decimals, parseInt(tokenDetails.decimals, 10));
    const positionInRanking = this._getLinkPosition(toPayWei, link, linksInSlots);

    if (toPayWei.gt(this.props.tokenDetails.balance)) {
      this.setState({ toPay, positionInRanking, probability: newProbability, hasInsufficientFunds: true });
    } else {
      this.setState({ toPay, positionInRanking, probability: newProbability, hasInsufficientFunds: false });
    }
  }

  _onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputError = this._validateInputValue(e.target.value);
    if (inputError) {
      this.setState({ inputError, toPay: e.target.value });
      return;
    }
    const { link, linksInSlots, tokenDetails } = this.props;
    const { sum, isInSlots } = this.state;

    const toPay = e.target.value;
    const toPayWei = new BigNumber(toWei(toPay, tokenDetails.decimals));
    const linkTotalScore = toPayWei.add(link.score.toFixed(0));

    let positionInRanking;
    if (isInSlots) {
      const probability = linkTotalScore
        .div(sum.add(toPayWei)).mul(1000).round().div(10).toNumber();
      positionInRanking = this._getLinkPosition(linkTotalScore, link, linksInSlots);

      this.setState({ probability });
    } else {
      const lastLinkInSlots = this.props.linksInSlots[this.props.linksInSlots.length - 1];
      if (linkTotalScore.gt(lastLinkInSlots.score.toFixed(0))) {
        positionInRanking = this.props.linksInSlots
          .map((l) => new BigNumber(l.score.toFixed(0)))
          .concat([linkTotalScore])
          .sort((a, b) => b.comparedTo(a))
          .indexOf(linkTotalScore);

      } else {
        positionInRanking = null;
      }
    }

    if (toPayWei.gt(this.props.tokenDetails.balance)) {
      this.setState({ toPay, positionInRanking, hasInsufficientFunds: true, inputError: '' });
    } else {
      this.setState({ toPay, positionInRanking, hasInsufficientFunds: false, inputError: '' });
    }
  }

  _getLinkPosition = (linkTotalScore: BigNumber, link: IRemoteLink, links: IRemoteLink[]) => {
    const positionInRanking = links
      .map((l) => l === link ? linkTotalScore : new BigNumber(l.score.toFixed(0)))
      .sort((a, b) => b.comparedTo(a))
      .indexOf(linkTotalScore);

    return positionInRanking >= 0 ? positionInRanking : null;
  }

  _validateInputValue = (value: string) => {
    const rules = [
      R.number,
      R.value((v: number) => v >= 0, 'Cannot be negative'),
      R.value((v: string) => {
        const dotIndex = v.indexOf('.');
        if (dotIndex !== -1) {
          return v.length - 1 - dotIndex <= parseInt(this.props.tokenDetails.decimals, 10);
        }
        return true;
      }, 'Invalid value'),
    ];

    return validate(rules, value);
  }
}
