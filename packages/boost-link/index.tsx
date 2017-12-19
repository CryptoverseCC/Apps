import React, { Component } from 'react';
import Web3 from 'web3';
import { BN } from 'web3-utils';
import { PromiEvent, TransactionReceipt } from 'web3/types';

import core from '@userfeeds/core/src';
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
import { toWei } from '@linkexchange/utils/balance';

import If from '@linkexchange/components/src/utils/If';

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
  value?: string;
  validationError?: string;
  probability: string;
  formTop?: number;
  formLeft?: number;
  formOpacity?: number;
}

const valueValidationRules = [
  R.required,
  R.number,
  R.value((v: number) => v > 0, 'Have to be positive value'),
  R.value((v: string) => {
    const dotIndex = v.indexOf('.');
    if (dotIndex !== -1) {
      return v.length - 1 - dotIndex <= 18;
    }
    return true;
  }, 'Invalid value'),
];

export default class BoostLink extends Component<IBidLinkProps, IBidLinkState> {
  _buttonRef: Element;
  state: IBidLinkState = {
    visible: false,
    sum: this.props.links.reduce((acc, { score }) => acc.add(new BN(score.toFixed(0))), new BN(0)),
    probability: '-',
  };

  render() {
    const { link, asset, disabled, disabledReason, tokenDetails } = this.props;
    const { visible, value, validationError, probability, formLeft, formTop, formOpacity } = this.state;
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
            <div className={style.inputRow}>
              <Input
                placeholder="Value"
                value={value}
                onChange={this._onValueChange}
                errorMessage={validationError}
              />
              <p className={style.equalSign}>=</p>
              <Input placeholder="Estimated Probability" disabled value={`${probability} %`} />
            </div>
            <p>
              Your balance: {tokenDetails.balanceWithDecimalPoint} {tokenDetails.symbol}.
            </p>
            <TransactionProvider
              startTransaction={this._onSendClick}
              renderReady={() => (
                <NewButton
                  disabled={!!validationError || !value}
                  style={{ marginLeft: 'auto' }}
                  onClick={this._onSendClick}
                  color="primary"
                >
                  Send
                </NewButton>
              )}
            />
          </div>
        </If>
      </div>
    );
  }

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

  _onValueChange = (e) => {
    const value = e.target.value;
    this.setState({ value });

    const { link } = this.props;
    const { sum } = this.state;

    const validationError = validate(valueValidationRules, value);

    if (!validationError) {
      const valueInWei = toWei(value, this.props.tokenDetails.decimals);
      const rawProbability = (new BN(link.score.toFixed(0)).add(new BN(valueInWei)).muln(10000))
        .div(sum.add(new BN(valueInWei)));
      const probability =
        `${rawProbability.divn(100).toString(10)}.${rawProbability.modn(100).toString(10).slice(0, 3)}`;
      this.setState({ probability, validationError });
    } else {
      this.setState({ probability: '-', validationError });
    }
  }

  _onSendClick = () => {
    const { asset, recipientAddress, web3 } = this.props;
    const { id } = this.props.link;
    const { value } = this.state;
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
        value,
        false,
        claim,
      );
    } else {
      sendClaimPromise = core.ethereum.claims.sendClaimValueTransfer(web3, recipientAddress, value, claim);
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
