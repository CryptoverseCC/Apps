import React, { Component, Children } from 'react';
import { findDOMNode } from 'react-dom';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { TransitionGroup } from 'react-transition-group';
import { PromiEvent, TransactionReceipt } from 'web3/types';

import core from '@userfeeds/core/src';
import Button from '@linkexchange/components/src/Button';
import Tooltip from '@linkexchange/components/src/Tooltip';
import { WidgetSettings } from '@linkexchange/widget-settings';
import { IRemoteLink } from '@linkexchange/types/link';
import { urlWithoutQueryIfLinkExchangeApp } from '@linkexchange/utils/locationWithoutQueryParamsIfLinkExchangeApp';
import If from '@linkexchange/components/src/utils/If';
import { toWei, MAX_VALUE_256 } from '@linkexchange/utils/balance';
import { openLinkexchangeUrl } from '@linkexchange/utils/openLinkexchangeUrl';

import Slide from './components/Slide';
import Result from './components/Result';
import Booster from './components/Booster';
import AskForAllowance from './components/AskForAllowance';
import TransactionInProgress from '@linkexchange/components/src/TransactionInProgress';

import * as style from './boostLink.scss';
import { observer, inject } from 'mobx-react';
import { IWeb3Store } from '@linkexchange/web3-store';
import { IWidgetSettings } from '@linkexchange/types/widget';
import { resolveOnTransactionHash } from '@userfeeds/core/src/utils';

interface IProps {
  link: IRemoteLink;
  web3Store?: IWeb3Store;
  widgetSettingsStore?: IWidgetSettings;
  onSuccess?(linkId: string): void;
  onError?(e: any): void;
}

interface IState {
  visible: boolean;
  stage: 'booster' | 'allowance' | 'allowanceInProgress' | 'boostInProgress' | 'success' | 'error';
  amount?: string;
  txHash?: string;
  formTop?: number;
  formLeft?: number;
  formOpacity?: number;
}

@inject('widgetSettingsStore', 'web3Store')
@observer
export default class BoostLink extends Component<IProps, IState> {
  _buttonRef: Element;
  state: IState = {
    visible: false,
    stage: 'booster',
  };

  render() {
    const { link, children } = this.props;
    const { stage, amount, visible, formLeft, formTop, formOpacity } = this.state;

    let decoratedChild;
    try {
      decoratedChild = React.cloneElement(Children.only(children), {
        onClick: this._onBoostClick,
      });
    } catch (e) {
      decoratedChild = null;
    }

    return (
      <div ref={this._onButtonRef} className={style.self}>
        {decoratedChild}
        <If condition={visible}>
          <div className={style.overlay} onClick={this._close} />
          <TransitionGroup
            ref={this._onFormRef}
            className={style.form}
            style={{ top: formTop, left: formLeft, opacity: formOpacity }}
          >
            {stage === 'booster' && (
              <Slide key="booster" className={style.slideContainer}>
                <Booster link={link} onSend={this._onSendClick} />
              </Slide>
            )}
            {stage === 'allowance' && (
              <Slide key="allowance" className={style.slideContainer}>
                <AskForAllowance
                  startTransaction={this._onAllowance}
                  goBack={() => this.setState({ stage: 'booster' })}
                />
              </Slide>
            )}
            {stage === 'allowanceInProgress' && (
              <Slide key="allowanceInProgress" className={style.slideContainer}>
                <TransactionInProgress>
                  Receiving confirmation to use your tokens by our contract.
                </TransactionInProgress>
              </Slide>
            )}
            {stage === 'boostInProgress' && (
              <Slide key="boostInProgress" className={style.slideContainer}>
                <TransactionInProgress>Payment in progress</TransactionInProgress>
              </Slide>
            )}
            {stage === 'success' && (
              <Slide key="success" className={style.slideContainer}>
                <Result onClick={this._openBoostStatus} type="success">
                  <h2>Congratulations!</h2>
                  Your transaction has been sent.
                </Result>
              </Slide>
            )}
            {stage === 'error' && (
              <Slide key="error" className={style.slideContainer}>
                <Result onClick={() => this.setState({ stage: 'booster' })} type="failure">
                  Your transaction has been rejected.
                </Result>
              </Slide>
            )}
          </TransitionGroup>
        </If>
      </div>
    );
  }

  _onButtonRef = (ref) => (this._buttonRef = ref);

  _onFormRef = (elmRef) => {
    if (!elmRef) {
      return;
    }
    const ref = findDOMNode(elmRef);

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
  };

  _onBoostClick = () => {
    this.setState({ visible: true, formOpacity: 0 });
  };

  _close = () => {
    this.setState({ visible: false });
    this.setState({ stage: 'booster' });
  };

  _onSendClick = async (toPay: string) => {
    const { web3Store } = this.props;

    let nextStage: 'boostInProgress' | 'allowance' = 'boostInProgress';
    if (web3Store!.shouldApprove(toWei(toPay, web3Store!.decimals!))) {
      nextStage = 'allowance';
    }
    this.setState({ stage: nextStage, amount: toPay }, () => {
      if (nextStage === 'boostInProgress') {
        this._sendClaim();
      }
    });
  };

  _onAllowance = async (unlimited: boolean) => {
    try {
      this.setState({ stage: 'allowanceInProgress' });
      const { approve, decimals } = this.props.web3Store!;
      const { amount: toPay } = this.state;
      const weiToApprove = unlimited ? MAX_VALUE_256 : toWei(toPay!, decimals!);
      const { promiEvent: approveRequest } = await this.props.web3Store!.approve(weiToApprove);
      const transactionHash = await resolveOnTransactionHash(approveRequest);
      this._sendClaim();
    } catch (e) {
      this.setState({ stage: 'error' });
    }
  };

  private createClaim(target, location) {
    return {
      claim: { target },
      ...(location
        ? {
            credits: [
              {
                type: 'interface',
                value: location,
              },
            ],
          }
        : {}),
    };
  }

  _sendClaim = async () => {
    try {
      this.setState({ stage: 'boostInProgress' });
      const { sendClaim } = this.props.web3Store!;
      const { recipientAddress } = this.props.widgetSettingsStore!;
      const { amount: toPay } = this.state;
      const { id } = this.props.link;
      const location = urlWithoutQueryIfLinkExchangeApp();
      const claim = this.createClaim(id, location);
      const { promiEvent: claimRequest } = await sendClaim(claim, recipientAddress, toPay);
      this.setState({ stage: 'boostInProgress' });
      const transactionHash = await resolveOnTransactionHash(claimRequest);
      this.setState({ stage: 'success', txHash: transactionHash });
    } catch (e) {
      this.setState({ stage: 'error' });
    }
  };

  _openBoostStatus = () => {
    const { asset } = this.props.widgetSettingsStore!;
    const { txHash } = this.state;

    openLinkexchangeUrl('/direct/status/boost', { txHash, asset });
  };
}
