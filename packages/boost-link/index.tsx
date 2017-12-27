import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { PromiEvent, TransactionReceipt } from 'web3/types';

import core from '@userfeeds/core/src';
import Button from '@linkexchange/components/src/Button';
import Tooltip from '@linkexchange/components/src/Tooltip';
import { IRemoteLink } from '@linkexchange/types/link';
import {
  locationWithoutQueryParamsIfLinkExchangeApp,
} from '@linkexchange/utils/locationWithoutQueryParamsIfLinkExchangeApp';
import { ITokenDetails } from '@linkexchange/token-details-provider';
import If from '@linkexchange/components/src/utils/If';
import Switch from '@linkexchange/components/src/utils/Switch';

import Booster from './components/Booster';
import Confirmation from './components/Confirmation';
import AskForAllowance from './components/AskForAllowance';

import * as style from './boostLink.scss';
import { toWei } from '../utils/balance';

interface IBidLinkProps {
  web3: Web3;
  tokenDetails: ITokenDetails;
  disabled?: boolean;
  disabledReason?: string;
  link: IRemoteLink;
  linksInSlots: IRemoteLink[];
  asset: string;
  recipientAddress: string;
  onSuccess?(linkId: string): void;
  onError?(e: any): void;
}

interface IBidLinkState {
  visible: boolean;
  stage: 'booster' | 'allowance' | 'confirmation';
  amount?: string;
  positionInSlots?: number | null;
  formTop?: number;
  formLeft?: number;
  formOpacity?: number;
}

export default class BoostLink extends Component<IBidLinkProps, IBidLinkState> {
  _buttonRef: Element;
  state: IBidLinkState = {
    visible: false,
    stage: 'booster',
  };

  render() {
    const { link, linksInSlots, disabled, disabledReason, tokenDetails } = this.props;
    const { stage, amount, positionInSlots, visible, formLeft, formTop, formOpacity } = this.state;

    return (
      <div ref={this._onButtonRef} className={style.self}>
        <Tooltip text={disabledReason}>
          <Button secondary className={style.boostButton} disabled={disabled} onClick={this._onBoostClick}>
            Boost
          </Button>
        </Tooltip>
        <If condition={visible && !disabled}>
          <div className={style.overlay} onClick={this._close} />
          <div
            ref={this._onFormRef}
            className={style.form}
            style={{ top: formTop, left: formLeft, opacity: formOpacity }}
          >
            <Switch expresion={stage}>
              <Switch.Case condition="booster">
                <Booster
                  link={link}
                  linksInSlots={linksInSlots}
                  tokenDetails={tokenDetails}
                  onSend={this._onSendClick}
                />
              </Switch.Case>
              <Switch.Case condition="allowance">
                <AskForAllowance
                  positionInSlots={positionInSlots!}
                  tokenDetails={tokenDetails}
                  startTransaction={this._onAllowance}
                />
              </Switch.Case>
              <Switch.Case condition="confirmation">
                <Confirmation
                  amount={amount!}
                  positionInSlots={positionInSlots!}
                  tokenDetails={tokenDetails}
                  startTransaction={this._onConfirm}
                />
              </Switch.Case>
            </Switch>
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

  _close = () => {
    this.setState({ visible: false });
    this.setState({ stage: 'booster' });
  }

  _onSendClick = async (toPay: string, positionInSlots: number | null) => {
    const { web3, asset, tokenDetails } = this.props;
    const [_, token] = this.props.asset.split(':');

    let nextStage: 'confirmation' | 'allowance' = 'confirmation';
    if (token) {
      const tokenWei = toWei(toPay, tokenDetails.decimals);
      const allowance = await core.ethereum.claims.allowanceUserfeedsContractTokenTransfer(web3, token);
      if (new BigNumber(tokenWei).gt(allowance)) {
        nextStage = 'allowance';
      }
    }

    this.setState({ stage: nextStage, amount: toPay, positionInSlots });
  }

  _onAllowance = (unlimited: boolean) => {
    const { asset, web3, tokenDetails } = this.props;
    const { amount: toPay } = this.state;
    const [, tokenAddress] = asset.split(':');

    const approvePromise = core.ethereum.claims.approveUserfeedsContractTokenTransfer(
      web3,
      tokenAddress,
      unlimited ? new BigNumber(2).pow(256).minus(1) : toWei(toPay!, tokenDetails.decimals),
    );

    approvePromise.then(({ promiEvent }) => {
      promiEvent
        .on('transactionHash', () => this.setState({ stage: 'confirmation' }))
        .on('error', (e) => {
          if (this.props.onError) {
            this.props.onError(e);
          }
          this._close();
        });
    });

    return approvePromise;
  }

  _onConfirm = () => {
    const { asset, recipientAddress, web3 } = this.props;
    const { amount: toPay } = this.state;
    const { id } = this.props.link;
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
            this._close();
          }
        })
        .on('error', (e) => {
          if (this.props.onError) {
            this.props.onError(e);
          }
          this._close();
        });
    });

    return sendClaimPromise;
  }
}
