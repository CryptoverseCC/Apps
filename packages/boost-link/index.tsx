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
import { ITokenDetails } from '@linkexchange/token-details-provider';
import If from '@linkexchange/components/src/utils/If';
import { toWei } from '@linkexchange/utils/balance';
import { openLinkexchangeUrl } from '@linkexchange/utils/openLinkexchangeUrl';

import Slide from './components/Slide';
import Result from './components/Result';
import Booster from './components/Booster';
import AskForAllowance from './components/AskForAllowance';
import TransactionInProgress from './components/TransactionInProgress';

import * as style from './boostLink.scss';

interface IProps {
  web3: Web3;
  tokenDetails: ITokenDetails;
  disabled?: boolean;
  disabledReason?: string;
  link: IRemoteLink;
  linksInSlots: IRemoteLink[];
  widgetSettings: WidgetSettings;
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

export default class BoostLink extends Component<IProps, IState> {
  _buttonRef: Element;
  state: IState = {
    visible: false,
    stage: 'booster',
  };

  render() {
    const { link, linksInSlots, widgetSettings, disabled, disabledReason, tokenDetails, children } = this.props;
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
        <Tooltip text={disabledReason}>
          {decoratedChild || (
            <Button secondary className={style.boostButton} disabled={disabled} onClick={this._onBoostClick}>
              Boost
            </Button>
          )}
        </Tooltip>
        <If condition={visible && !disabled}>
          <div className={style.overlay} onClick={this._close} />
          <TransitionGroup
            ref={this._onFormRef}
            className={style.form}
            style={{ top: formTop, left: formLeft, opacity: formOpacity }}
          >
            {stage === 'booster' && (
              <Slide key="booster" className={style.slideContainer}>
                <Booster
                  link={link}
                  linksInSlots={linksInSlots}
                  tokenDetails={tokenDetails}
                  slots={widgetSettings.slots}
                  onSend={this._onSendClick}
                />
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
    const { web3, widgetSettings, tokenDetails } = this.props;
    const { asset } = widgetSettings;
    const [_, token] = asset.split(':');

    let nextStage: 'boostInProgress' | 'allowance' = 'boostInProgress';
    if (token) {
      const tokenWei = toWei(toPay, tokenDetails.decimals);
      const allowance = await core.ethereum.claims.allowanceUserfeedsContractTokenTransfer(web3, token);
      if (new BigNumber(tokenWei).gt(allowance)) {
        nextStage = 'allowance';
      }
    }
    this.setState({ stage: nextStage, amount: toPay }, () => {
      if (nextStage === 'boostInProgress') {
        this._sendClaim();
      }
    });
  };

  _onAllowance = (unlimited: boolean) => {
    const { widgetSettings, web3, tokenDetails } = this.props;
    const { asset } = widgetSettings;
    const { amount: toPay } = this.state;
    const [, tokenAddress] = asset.split(':');

    this.setState({ stage: 'allowanceInProgress' });

    const approvePromise = core.ethereum.claims.approveUserfeedsContractTokenTransfer(
      web3,
      tokenAddress,
      unlimited ? new BigNumber(2).pow(256).minus(1) : toWei(toPay!, tokenDetails.decimals),
    );

    approvePromise.then(({ promiEvent }) => {
      promiEvent
        .on('transactionHash', () => {
          this._sendClaim();
          this.setState({ stage: 'boostInProgress' });
        })
        .on('error', (e) => {
          this.setState({ stage: 'error' });
        });
    });

    return approvePromise;
  };

  _sendClaim = () => {
    const { widgetSettings, web3 } = this.props;
    const { asset, recipientAddress } = widgetSettings;
    const { amount: toPay } = this.state;
    const { id } = this.props.link;
    const location = urlWithoutQueryIfLinkExchangeApp();

    const claim = {
      claim: { target: id },
      credits: [
        {
          type: 'interface',
          value: location,
        },
      ],
    };

    const [_, token] = asset.split(':');
    let sendClaimPromise: Promise<{ promiEvent: PromiEvent<TransactionReceipt> }>;
    if (token) {
      sendClaimPromise = core.ethereum.claims.sendClaimTokenTransfer(web3, recipientAddress, token, toPay, claim);
    } else {
      sendClaimPromise = core.ethereum.claims.sendClaimValueTransfer(web3, recipientAddress, toPay, claim);
    }

    sendClaimPromise.then(({ promiEvent }) => {
      promiEvent
        .on('transactionHash', (txHash: string) => {
          this.setState({ stage: 'success', txHash });
        })
        .on('error', (e) => {
          this.setState({ stage: 'error' });
        });
    });

    return sendClaimPromise;
  };

  _openBoostStatus = () => {
    const { widgetSettings } = this.props;
    const { txHash } = this.state;

    openLinkexchangeUrl('/direct/status/boost', { txHash, asset: widgetSettings.asset });
  };
}
