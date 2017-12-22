import React, { Component, ChangeEvent } from 'react';
import classnames from 'classnames';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { PromiEvent, TransactionReceipt } from 'web3/types';

import core from '@userfeeds/core/src';
import Icon from '@linkexchange/components/src/Icon';
import Input from '@linkexchange/components/src/Input';
import Button from '@linkexchange/components/src/Button';
import NewButton from '@linkexchange/components/src/NewButton';
import Tooltip from '@linkexchange/components/src/Tooltip';
import { IRemoteLink } from '@linkexchange/types/link';
import TransactionProvider from '@linkechange/transaction-provider';
import { R, validate } from '@linkexchange/utils/validation';
import {
  locationWithoutQueryParamsIfLinkExchangeApp,
} from '@linkexchange/utils/locationWithoutQueryParamsIfLinkExchangeApp';
import { ITokenDetails } from '@linkexchange/token-details-provider';
import { fromWeiToString, toWei } from '@linkexchange/utils/balance';

import If from '@linkexchange/components/src/utils/If';

import Slider from './components/Slider';

import * as style from './boostLink.scss';

interface IBidLinkProps {
  web3: Web3;
  tokenDetails: ITokenDetails;
  disabled?: boolean;
  disabledReason?: string;
  link: IRemoteLink;
  links: IRemoteLink[];
  asset: string;
  recipientAddress: string;
  onSuccess?(linkId: string): void;
  onError?(e: any): void;
}

interface IBidLinkState {
  visible: boolean;
  sum: BigNumber;
  toPay: string;
  possitionInRanking: number;
  insufficientFunds: boolean;
  probability: number | null;
  formTop?: number;
  formLeft?: number;
  formOpacity?: number;
}

export default class BoostLink extends Component<IBidLinkProps, IBidLinkState> {
  _buttonRef: Element;
  state: IBidLinkState = {
    visible: false,
    toPay: '0',
    possitionInRanking: this.props.links.indexOf(this.props.link),
    insufficientFunds: false,
    sum: this.props.links.reduce((acc, { score }) => acc.add(score.toFixed(0)), new BigNumber(0)),
    probability: null,
  };

  render() {
    const { link, asset, disabled, disabledReason, tokenDetails } = this.props;
    const { visible, toPay, probability, formLeft, formTop, formOpacity, insufficientFunds, possitionInRanking }
      = this.state;
    const [desiredNetwork] = asset.split(':');

    return (
      <div ref={this._onButtonRef} className={style.self}>
        <Tooltip text={disabledReason}>
          <Button secondary className={style.boostButton} disabled={disabled} onClick={this._onBoostClick}>
            Boost
          </Button>
        </Tooltip>
        <If condition={visible && !disabled}>
          <div className={style.overlay} onClick={this._onOverlayClick} />
          <div
            ref={this._onFormRef}
            className={style.form}
            style={{ top: formTop, left: formLeft, opacity: formOpacity }}
          >
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
              {insufficientFunds && <span className={style.insufficientFunds}>Insufficient funds</span>}
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
          </div>
        </If>
      </div>
    );
  }

//   <TransactionProvider
//   startTransation={this._onSendClick}
//   renderReady={() => (
//     <NewButton
//       disabled={!!validationError || !value}
//       style={{ marginLeft: 'auto' }}
//       onClick={this._onSendClick}
//       color="primary"
//     >
//       Send
//     </NewButton>
//   )}
// />

  _onButtonRef = (ref) => (this._buttonRef = ref);

  _onFormRef = (ref: HTMLDivElement) => {
    if (!ref) {
      return;
    }

    setTimeout(() => {
      const buttonRect = this._buttonRef.getBoundingClientRect();
      const formRect = ref.getBoundingClientRect();
      const formHeight = formRect.height;
      const formWidth = formRect.width;

      let formTop;
      if (window.innerHeight < buttonRect.bottom + formHeight) {
        // Display above
        formTop = buttonRect.top - formHeight;
      } else {
        // Display below
        formTop = buttonRect.bottom;
      }

      let formLeft;
      if (buttonRect.right - formWidth > 0) {
        // Display on left
        formLeft = buttonRect.right - formWidth;
      } else {
        // Display on right
        formLeft = buttonRect.left;
      }

      this.setState({ formTop, formLeft, formOpacity: 1 });
    });
  }

  _onBoostClick = () => {
    this.setState({ visible: true, formOpacity: 0 });
  }

  _onOverlayClick = () => {
    this.setState({ visible: false });
  }

  _onSliderChange = (newProbability: number) => {
    this.setState({ probability: newProbability });

    const { link, links, tokenDetails } = this.props;
    const { sum } = this.state;

    const toPayWei = new BigNumber(100).mul(link.score.toFixed(0)).sub(sum.mul(newProbability))
        .div((newProbability - 100).toFixed(1)).truncated();

    const toPay = fromWeiToString(toPayWei.toString(), tokenDetails.decimals, parseInt(tokenDetails.decimals, 10));

    const linkTotalScore = toPayWei.add(link.score.toFixed(0));
    const possitionInRanking = links
      .map((l) => l === link ? linkTotalScore : new BigNumber(l.score.toFixed(0)))
      .sort((a, b) => b.comparedTo(a))
      .indexOf(linkTotalScore);

    if (toPayWei.gt(this.props.tokenDetails.balance)) {
      this.setState({ toPay, possitionInRanking, insufficientFunds: true });
    } else {
      this.setState({ toPay, possitionInRanking, insufficientFunds: false });
    }
  }

  _onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { link, links, tokenDetails } = this.props;
    const { sum } = this.state;

    const toPay = e.target.value;
    const toPayWei = new BigNumber(toWei(toPay, tokenDetails.decimals));
    const probability = new BigNumber(toPayWei).add(link.score.toFixed(0))
      .div(sum.add(toPayWei)).mul(1000).round().div(10).toNumber();

    // Extract this!!!
    const linkTotalScore = toPayWei.add(link.score.toFixed(0));
    const possitionInRanking = links
      .map((l) => l === link ? linkTotalScore : new BigNumber(l.score.toFixed(0)))
      .sort((a, b) => b.comparedTo(a))
      .indexOf(linkTotalScore);

    if (toPayWei.gt(this.props.tokenDetails.balance)) {
      this.setState({ toPay, probability, possitionInRanking, insufficientFunds: true });
    } else {
      this.setState({ toPay, probability, possitionInRanking, insufficientFunds: false });
    }
  }

  _onSendClick = () => {
    const { asset, recipientAddress, web3 } = this.props;
    const { id } = this.props.link;
    const { toPay } = this.state;
    const location = locationWithoutQueryParamsIfLinkExchangeApp();

    const claim = {
      claim: { target: id },
      credits: [
        {
          type: 'interface',
          value: location,
        },
      ],
    };

    const [_, token] = this.props.asset.split(':');
    let sendClaimPromise: Promise<{ promiEvent: PromiEvent<TransactionReceipt>}>;
    if (token) {
      sendClaimPromise = core.ethereum.claims.sendClaimTokenTransfer(
        web3,
        recipientAddress,
        token,
        toPay,
        false,
        claim,
      );
    } else {
      sendClaimPromise = core.ethereum.claims.sendClaimValueTransfer(web3, recipientAddress, toPay, claim);
    }
    sendClaimPromise.then(({ promiEvent }) => {
      promiEvent
        .on('transactionHash', (transactionId: string) => {
          if (this.props.onSuccess) {
            this.props.onSuccess(transactionId);
          }
        })
        .on('error', (e) => {
          if (this.props.onError) {
            this.props.onError(e);
          }
        });
    });

    return sendClaimPromise;
  }
}
