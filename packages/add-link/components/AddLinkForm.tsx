import React, { Component } from 'react';
import Web3 from 'web3';
import { BN } from 'web3-utils';
import { TransactionReceipt, PromiEvent } from 'web3/types';

import core from '@userfeeds/core/src';
import { resolveOnTransationHash } from '@userfeeds/core/src/utils/index';
import { toWei, MAX_VALUE_256 } from '@linkexchange/utils/balance';
import { IBaseLink } from '@linkexchange/types/link';
import Input from '@linkexchange/components/src/Form/Input';
import Button from '@linkexchange/components/src/NewButton';
import Checkbox from '@linkexchange/components/src/Checkbox';
import { R } from '@linkexchange/utils/validation';
import TransactionProvider from '@linkexchange/transaction-provider';
import { Title, Error, TextField, validateField } from '@linkexchange/components/src/Form/Field';
import { Form, Field } from 'react-final-form';

import { urlWithoutQueryIfLinkExchangeApp } from '@linkexchange/utils/locationWithoutQueryParamsIfLinkExchangeApp';

import * as style from './addLinkForm.scss';

interface IAddLinkFormProps {
  web3: Web3;
  asset: string;
  tokenDetails: any;
  recipientAddress: string;
  minimalValue?: string;
  onSuccess(linkId: string): void;
  onError(error: any): void;
  onChange?: (link: IBaseLink) => void;
}

interface IAddLinkFormState {
  title: string;
  summary: string;
  target: string;
  value: string;
  unlimitedApproval: boolean;
  errors: {
    title?: string;
    summary?: string;
    target?: string;
    value?: string;
  };
}

export default class AddLinkForm extends Component<IAddLinkFormProps, IAddLinkFormState> {
  state: IAddLinkFormState = {
    title: '',
    summary: '',
    target: 'http://',
    value: this.props.minimalValue || '',
    unlimitedApproval: false,
    errors: {},
  };

  render() {
    const { tokenDetails } = this.props;
    const { title, summary, target, value, unlimitedApproval, errors } = this.state;

    return (
      <div className={style.self}>
        <Form
          onSubmit={this._onSubmit}
          render={(fieldProps) => (
            <>
              <Field
                title="Headline"
                component={TextField}
                name="title"
                validate={validateField([R.required, R.maxLength(35)])}
              />
              <Field
                title="Description"
                component={TextField}
                name="summary"
                validate={validateField([R.required, R.maxLength(70)])}
              />
              <Field title="Link" component={TextField} name="target" validate={validateField([R.required, R.link])} />
              <Field
                title="Initial Fee"
                component={TextField}
                name="value"
                validate={validateField([
                  R.required,
                  R.number,
                  R.value((v: number) => v >= 0, 'Cannot be negative'),
                  R.value(
                    (v: string) => parseInt(v, 10) >= (this.props.minimalValue || 0),
                    `Has to be greater than minimal value.`,
                  ),
                  R.value((v: string) => {
                    const dotIndex = v.indexOf('.');
                    if (dotIndex !== -1) {
                      return v.length - 1 - dotIndex <= 18;
                    }
                    return true;
                  }, 'Invalid value'),
                ])}
              />
              <TransactionProvider
                startTransaction={this._onSubmit}
                renderReady={() => (
                  <Button disabled={!fieldProps.valid} style={{ width: '100%' }} color="primary">
                    Create
                  </Button>
                )}
              />
            </>
          )}
        />
      </div>
    );
  }

  _onSubmit = () => {
    const { recipientAddress, web3, tokenDetails } = this.props;
    const { value, unlimitedApproval } = this.state;

    const claim = this._createClaim();
    const token = this._getTokenAddress();
    const toPayWei = toWei(value!, tokenDetails.decimals);

    let sendClaimPromise: Promise<{ promiEvent: PromiEvent<TransactionReceipt> }>;
    if (token) {
      sendClaimPromise = core.ethereum.claims.allowanceUserfeedsContractTokenTransfer(web3, token).then((allowance) => {
        let promise: Promise<any> = Promise.resolve(null);
        if (new BN(allowance).lte(new BN(toPayWei))) {
          promise = core.ethereum.claims
            .approveUserfeedsContractTokenTransfer(web3, token, unlimitedApproval ? MAX_VALUE_256 : toPayWei)
            .then(({ promiEvent }) => resolveOnTransationHash(promiEvent));
        }

        return promise.then(() =>
          core.ethereum.claims.sendClaimTokenTransfer(web3, recipientAddress, token, value, claim),
        );
      });
    } else {
      sendClaimPromise = core.ethereum.claims.sendClaimValueTransfer(web3, recipientAddress, value, claim);
    }

    sendClaimPromise.then(({ promiEvent }) => {
      promiEvent
        .on('transactionHash', (linkId) => {
          this.props.onSuccess(linkId);
        })
        .on('error', (e) => {
          this.props.onError(e.message);
        });
    });
    return sendClaimPromise;
  };

  _createClaim() {
    const { target, title, summary } = this.state;
    const location = urlWithoutQueryIfLinkExchangeApp();

    return {
      type: ['link'],
      claim: { target, title, summary },
      credits: [
        {
          type: 'interface',
          value: location,
        },
      ],
    };
  }

  _getTokenAddress() {
    return this.props.asset.split(':')[1];
  }
}
