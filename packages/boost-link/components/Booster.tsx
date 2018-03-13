import React, { Component, ChangeEvent } from 'react';
import classnames from 'classnames/bind';
import BigNumber from 'bignumber.js';

import Icon from '@linkexchange/components/src/Icon';
import { IRemoteLink, ILink } from '@linkexchange/types/link';
import { R, validate } from '@linkexchange/utils/validation';
import { ITokenDetails } from '@linkexchange/token-details-provider';
import { fromWeiToString, toWei } from '@linkexchange/utils/balance';
import MetaFox from '@linkexchange/images/metafox_straight.png';

import Header from './Header';
import Slider from './Slider';

import * as style from './booster.scss';
import { inject, observer } from 'mobx-react';
import { IWeb3Store } from '@linkexchange/web3-store';
import { IWidgetSettings } from '@linkexchange/types/widget';
import LinksStore from '@linkexchange/links-store';
const cx = classnames.bind(style);

interface IProps {
  link: IRemoteLink | ILink;
  links?: LinksStore;
  web3Store?: IWeb3Store;
  widgetSettingsStore?: IWidgetSettings;
  onSend(toPay: string): void;
}

interface IState {
  isInSlots: boolean;
  sum: BigNumber;
  toPay: string;
  inputError?: string;
  positionInSlots: number | null;
  hasInsufficientFunds: boolean;
  probability: number | null;
}

@inject('web3Store', 'widgetSettingsStore', 'links')
@observer
export default class Booster extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const { visibleLinks } = this.props.links!;

    const positionInRanking = visibleLinks.findIndex((l) => l.id === this.props.link.id);
    this.state = {
      isInSlots: positionInRanking >= 0,
      toPay: '0',
      positionInSlots: positionInRanking >= 0 ? positionInRanking : null,
      hasInsufficientFunds: false,
      sum: visibleLinks.reduce((acc, { score }) => acc.add(score.toFixed(0)), new BigNumber(0)),
      probability: null,
    };
  }

  componentWillMount() {
    if (this._isILink(this.props.link) && this.props.link.probability + 1 <= 100) {
      this._onSliderChange(this.props.link.probability + 1);
    }
  }

  render() {
    const { link, web3Store } = this.props;
    const { balanceWithDecimalPoint, symbol } = web3Store!;

    const { isInSlots, inputError, toPay, probability, positionInSlots, hasInsufficientFunds } = this.state;
    const disabled = this._isDisabled();

    return (
      <>
        <Header
          positionInSlots={positionInSlots}
          balanceWithDecimalPoint={balanceWithDecimalPoint!}
          symbol={symbol!}
        />
        {isInSlots && (
          <>
            <div className={style.probability}>
              Probability:
              <span className={cx(style.value, { disabled })}>
                {probability === null ? '-' : probability.toFixed(1)}
              </span>
            </div>
            <Slider
              className={style.slider}
              initialValue={this._getLinkProbability()}
              value={probability}
              onChange={this._onSliderChange}
            />
          </>
        )}
        {!isInSlots &&
          positionInSlots === null && (
            <div className={style.toAdd} onClick={this._boostToBeInSlots}>
              <p>
                This link needs{' '}
                <span className={style.value}>
                  {this._toAddToBeInSlots(3)} {symbol}
                </span>{' '}
              </p>
              <p>to be in slots.</p>
            </div>
          )}
        {!isInSlots &&
          positionInSlots !== null && (
            <div className={style.probability}>
              Probability:
              <span className={cx(style.value, { disabled })}>
                {probability === null ? '-' : probability.toFixed(1)}
              </span>
            </div>
          )}
        <div className={cx(style.footer, { hasInsufficientFunds, error: !!inputError })}>
          <div className={style.inputButtonContainer}>
            <input type="text" className={style.toPay} value={toPay} onChange={this._onInputChange} />
            <div className={style.tokenSymbol}>{symbol}</div>
            <div className={cx(style.next, { disabled })} onClick={this._onSendClick}>
              {!disabled ? <img src={MetaFox} className={style.fox} /> : <Icon name="x" className={style.icon} />}
            </div>
          </div>
          <span className={style.error}>{!inputError && hasInsufficientFunds ? 'Insufficient Funds' : inputError}</span>
        </div>
      </>
    );
  }

  _isZero = (amount) => {
    return new BigNumber(amount).isZero();
  };

  _boostToBeInSlots = () => {
    const toAdd = this._toAddToBeInSlots();
    const { toPay } = this.state;

    const totalToPay = new BigNumber(toPay).add(toAdd).toString(10);
    this._onInputChange({ target: { value: totalToPay } } as ChangeEvent<HTMLInputElement>); // ToDo make it better
  };

  _toAddToBeInSlots = (decimalPositions?: number) => {
    const { visibleLinks } = this.props.links!;
    const { link, widgetSettingsStore, web3Store } = this.props;
    const { decimals } = web3Store!;
    const { slots } = widgetSettingsStore!;
    const { toPay } = this.state;

    let toAdd = new BigNumber(1);
    if (visibleLinks.length === slots) {
      const lastLinkInSlots = visibleLinks[visibleLinks.length - 1];

      toAdd = new BigNumber(lastLinkInSlots.score.toFixed(0))
        .minus(new BigNumber(link.score.toFixed(0)).add(toWei(toPay!, decimals!)))
        .add(1);
    }

    return fromWeiToString(toAdd.toString(), decimals!, decimalPositions! || decimals!);
  };

  _onSendClick = () => {
    const { inputError, hasInsufficientFunds, toPay } = this.state;
    if (!!inputError || hasInsufficientFunds || this._isZero(toPay)) {
      return;
    }

    this.props.onSend(this.state.toPay);
  };

  _onSliderChange = (newProbability: number) => {
    const { visibleLinks } = this.props.links!;
    const { link, web3Store } = this.props;
    const { decimals, balance } = web3Store!
    const { sum } = this.state;

    if (this._isILink(link) && newProbability === link.probability) {
      this.setState({ probability: newProbability, toPay: '0' });
      return;
    }

    let toPayWei;
    toPayWei = new BigNumber(100)
      .mul(link.score.toFixed(0))
      .sub(sum.mul(newProbability))
      .div((newProbability - 100).toFixed(1))
      .truncated();
    if (toPayWei.lt(0)) {
      toPayWei = new BigNumber(0);
    }

    const toPay = fromWeiToString(
      toPayWei.toString(),
      decimals!,
      decimals! < 4 ? decimals! : 4,
    );
    const positionInSlots = this._getLinkPosition(toPayWei.add(link.score.toFixed(0)), link, visibleLinks);

    if (toPayWei.gt(balance)) {
      this.setState({
        toPay,
        positionInSlots,
        probability: newProbability,
        hasInsufficientFunds: true,
        inputError: undefined,
      });
    } else {
      this.setState({
        toPay,
        positionInSlots,
        probability: newProbability,
        hasInsufficientFunds: false,
        inputError: undefined,
      });
    }
  };

  _onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputError = this._validateInputValue(e.target.value);
    if (inputError) {
      this.setState({ inputError, toPay: e.target.value });
      return;
    }
    const { visibleLinks } = this.props.links!;
    const { link, widgetSettingsStore, web3Store } = this.props;
    const { slots } = widgetSettingsStore!;
    const { decimals, balance } = web3Store!;
    const { sum, isInSlots } = this.state;

    const toPay = e.target.value;
    const toPayWei = new BigNumber(toWei(toPay!, decimals!));
    const linkTotalScore = toPayWei.add(link.score.toFixed(0));

    let positionInSlots;
    if (isInSlots) {
      const probability = linkTotalScore
        .div(sum.add(toPayWei))
        .mul(1000)
        .round()
        .div(10)
        .toNumber();
      positionInSlots = this._getLinkPosition(linkTotalScore, link, visibleLinks);

      this.setState({ probability });
    } else {
      const lastLinkInSlots = visibleLinks[visibleLinks.length - 1];
      const newLinksInSlots = visibleLinks
        .map((l) => new BigNumber(l.score.toFixed(0)))
        .concat([linkTotalScore])
        .sort((a, b) => b.comparedTo(a))
        .slice(0, slots);

      positionInSlots = newLinksInSlots.indexOf(linkTotalScore) !== -1 ? newLinksInSlots.indexOf(linkTotalScore) : null;

      const probability = linkTotalScore
        .div(newLinksInSlots.reduce((acc, score) => score.add(acc), new BigNumber(0)))
        .mul(1000)
        .round()
        .div(10)
        .toNumber();

      this.setState({ probability });
    }

    if (toPayWei.gt(balance!)) {
      this.setState({ toPay, positionInSlots, hasInsufficientFunds: true, inputError: '' });
    } else {
      this.setState({ toPay, positionInSlots, hasInsufficientFunds: false, inputError: '' });
    }
  };

  _getLinkPosition = (linkTotalScore: BigNumber, link: IRemoteLink, links: IRemoteLink[]) => {
    const positionInSlots = links
      .map((l) => (l === link ? linkTotalScore : new BigNumber(l.score.toFixed(0))))
      .sort((a, b) => b.comparedTo(a))
      .indexOf(linkTotalScore);

    return positionInSlots >= 0 ? positionInSlots : null;
  };

  _validateInputValue = (value: string) => {
    const rules = [
      R.number,
      R.value((v: number) => v >= 0, 'Cannot be negative'),
      R.value((v: string) => {
        const dotIndex = v.indexOf('.');
        if (dotIndex !== -1) {
          return v.length - 1 - dotIndex <= this.props.web3Store!.decimals!;
        }
        return true;
      }, 'Invalid value'),
    ];

    return validate(rules, value, 'Input');
  };

  _isDisabled = () => {
    const { inputError, hasInsufficientFunds, toPay } = this.state;
    return !!inputError || hasInsufficientFunds || this._isZero(toPay);
  };

  _getLinkProbability = (): number => {
    const { link } = this.props;
    return (link as ILink).probability;
  };

  _isILink = (link: ILink | IRemoteLink): link is ILink => {
    return (link as ILink).probability !== undefined;
  };
}
