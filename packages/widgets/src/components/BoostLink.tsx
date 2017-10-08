import React, { Component } from 'react';

import core from '@userfeeds/core';
import Input from '@userfeeds/apps-components/src/Input';
import Button from '@userfeeds/apps-components/src/Button';
import Tooltip from '@userfeeds/apps-components/src/Tooltip';

import { ILink } from '../types';

import { R, validate } from '../utils/validation';
import web3 from '../utils/web3';

import If from './utils/If';

import * as style from './boostLink.scss';
import TokenDetailsProvider from './TokenDetailsProvider';

interface IBidLinkProps {
  disabled?: boolean;
  disabledReason?: string;
  link: ILink;
  links: ILink[];
  asset: string;
  recipientAddress: string;
  onSuccess?(linkId: string): void;
  onError?(e: any): void;
}

interface IBidLinkState {
  visible: boolean;
  sum: number;
  value?: string;
  validationError?: string;
  probability: string;
  formTop?: number;
  formLeft?: number;
  formOpacity?: number;
}

const valueValidationRules = [R.required, R.number, R.value((v: number) => v > 0, 'Have to be positive value'),
  R.value((v: string) => {
    const dotIndex = v.indexOf('.');
    if (dotIndex !== -1) {
      return v.length - 1 - dotIndex <= 18;
    }
    return true;
  }, 'Invalid value')];

export default class BoostLink extends Component<IBidLinkProps, IBidLinkState> {

  _buttonRef: Element;
  state: IBidLinkState = {
    visible: false,
    sum: this.props.links.reduce((acc, { score }) => acc + score, 0),
    probability: '-',
  };

  render() {
    const { link, disabled, disabledReason } = this.props;
    const { visible, value, validationError, probability, formLeft, formTop, formOpacity } = this.state;
    return (
      <div ref={this._onButtonRef} className={style.self}>
        <Tooltip text={disabledReason}>
          <Button secondary className={style.boostButton} disabled={disabled} onClick={this._onBoostClick}>Boost</Button>
        </Tooltip>
        <If condition={visible}>
          <div className={style.overlay} onClick={this._onOverlayClick} />
          <div ref={this._onFormRef} className={style.form} style={{ top: formTop, left: formLeft, opacity: formOpacity }}>
            <div className={style.inputRow}>
              <Input
                placeholder="Value"
                value={value}
                onInput={this._onValueChange}
                errorMessage={validationError}
              />
              <p className={style.equalSign}>=</p>
              <Input
                placeholder="Estimated Probability"
                disabled
                value={`${probability} %`}
              />
            </div>
            {this._getTokenAddress() &&
              <TokenDetailsProvider
                render={(tokenDetails) => (<p>
                  Your balance: {tokenDetails.balanceWithDecimalPoint} {tokenDetails.symbol}.
                </p>)}
              />
            }
            <Button
              disabled={!!validationError || !value}
              style={{ marginLeft: 'auto' }}
              onClick={this._onSendClick}
            >
              Send
            </Button>
          </div>
        </If>
      </div>
    );
  }

  _onButtonRef = (ref) => this._buttonRef = ref;

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
      const valueInEth = parseFloat(value);
      const valueInWei = parseFloat(web3.toWei(valueInEth, 'ether'));
      const rawProbability = (link.score + valueInWei) / (sum + valueInWei);
      const probability = (100 * rawProbability).toFixed(2);
      this.setState({ probability, validationError });
    } else {
      this.setState({ probability: '-', validationError });
    }
  }

  _onSendClick = () => {
    const { asset, recipientAddress } = this.props;
    const { id } = this.props.link;
    const { value } = this.state;

    const claim = {
      claim: { target: id },
      credits: [{
        type: 'interface',
        value: window.location.href,
      }],
    };

    const token = this._getTokenAddress();
    let sendClaimPromise;
    if (token) {
      sendClaimPromise = core.ethereum.claims.sendClaimTokenTransfer(
        web3, recipientAddress, token, value, false, claim,
      );
    } else {
      sendClaimPromise = core.ethereum.claims.sendClaimValueTransfer(web3, recipientAddress, value, claim);
    }
    sendClaimPromise
      .then((transactionId: string) => {
        if (this.props.onSuccess) {
          this.props.onSuccess(transactionId);
        }
      })
      .catch((e) => {
        if (this.props.onError) {
          this.props.onError(e);
        }
      })
      .then(() => {
        this.setState({ visible: false });
      });
  }

  _getTokenAddress() {
    return this.props.asset.split(':')[1];
  }
}
