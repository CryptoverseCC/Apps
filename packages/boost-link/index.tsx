import React, { Component } from 'react';
import classnames from 'classnames';
import Web3 from 'web3';
import { BN } from 'web3-utils';
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
import { fromWeiToString } from '@linkexchange/utils/balance';

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
  sum: BN;
  toPay: string;
  insufficientFunds: boolean;
  probability: string;
  formTop?: number;
  formLeft?: number;
  formOpacity?: number;
}

export default class BoostLink extends Component<IBidLinkProps, IBidLinkState> {
  _buttonRef: Element;
  state: IBidLinkState = {
    visible: false,
    toPay: '0',
    insufficientFunds: false,
    sum: this.props.links.reduce((acc, { score }) => acc.add(new BN(score.toFixed(0))), new BN(0)),
    probability: '-',
  };

  render() {
    const { link, asset, disabled, disabledReason, tokenDetails } = this.props;
    const { visible, toPay, probability, formLeft, formTop, formOpacity, insufficientFunds } = this.state;
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
            <p className={style.balance}>
              Your balance:
              <span className={style.amount}>{tokenDetails.balanceWithDecimalPoint} {tokenDetails.symbol}</span>
            </p>
            <div className={style.separator} />
            <div className={style.insufficientFundsContainer}>
              {insufficientFunds && <span className={style.insufficientFunds}>Insufficient funds</span>}
            </div>
            <div className={style.probabilities}>
              <p className={classnames(style.probability, style.currentProbability)}>{`${link.probability} %`}</p>
              <p className={style.dash}>&mdash;</p>
              <p className={style.probability}>{`${probability} %`}</p>
            </div>
            <Slider
              className={style.slider}
              initialValue={link.probability}
              onChange={this._onSliderChange}
            />
            <div className={style.footer}>
              <div className={style.toPay}>{toPay}</div>
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

  _onSliderChange = (newValue) => {
    this.setState({ probability: newValue.toFixed(1) });

    const { link, tokenDetails } = this.props;
    const { sum } = this.state;

    // ToDo Remove toFixed(0)!
    const toPayWei = new BN(100).mul(new BN(link.score.toFixed(0))).sub(new BN(newValue.toFixed(0)).mul(sum).muln(100))
        .div(new BN(((newValue - 100) * 100).toFixed(0))).toString();

    const toPay = fromWeiToString(toPayWei, tokenDetails.decimals, parseInt(tokenDetails.decimals, 10));

    if (new BN(this.props.tokenDetails.balance).lt(new BN(toPayWei))) {
      this.setState({ toPay, insufficientFunds: true });
    } else {
      this.setState({ toPay, insufficientFunds: false });
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
