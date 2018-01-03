import React, { Component } from 'react';
import Web3 from 'web3';
import { BN } from 'web3-utils';
import { TransactionReceipt, PromiEvent } from 'web3/types';

import core from '@userfeeds/core/src';
import { resolveOnTransationHash } from '@userfeeds/core/src/utils/index';
import { toWei, MAX_VALUE_256 } from '@linkexchange/utils/balance';
import { IBaseLink } from '@linkexchange/types/link';
import Loader from '@linkexchange/components/src/Loader';
import Tooltip from '@linkexchange/components/src/Tooltip';
import Input from '@linkexchange/components/src/Form/Input';
import Button from '@linkexchange/components/src/NewButton';
import Checkbox from '@linkexchange/components/src/Checkbox';
import { R, validate } from '@linkexchange/utils/validation';
import TransactionProvider from '@linkexchange/transaction-provider';
import Field, { Title, Error } from '@linkexchange/components/src/Form/Field';

import {
  locationWithoutQueryParamsIfLinkExchangeApp,
} from '@linkexchange/utils/locationWithoutQueryParamsIfLinkExchangeApp';

import * as style from './addLinkForm.scss';

interface IAddLinkFormProps {
  web3: Web3;
  asset: string;
  tokenDetails: any;
  recipientAddress: string;
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

const httpRegExp = /^https?:\/\//;
const urlRegExp = /^https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,8}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

const rules = {
  title: [R.required, R.maxLength(35)],
  summary: [R.required, R.maxLength(70)],
  target: [
    R.required,
    R.value((v: string) => httpRegExp.test(v), 'Has to start with http(s)://'),
    R.value((v: string) => urlRegExp.test(v), 'Has to be valid url'),
  ],
  value: [
    R.required,
    R.number,
    R.value((v: number) => v >= 0, 'Cannot be negative'),
    R.value((v: string) => {
      const dotIndex = v.indexOf('.');
      if (dotIndex !== -1) {
        return v.length - 1 - dotIndex <= 18;
      }
      return true;
    }, 'Invalid value'),
  ],
};

export default class AddLinkForm extends Component<IAddLinkFormProps, IAddLinkFormState> {
  state: IAddLinkFormState = {
    title: '',
    summary: '',
    target: 'http://',
    value: '',
    unlimitedApproval: false,
    errors: {},
  };

  render() {
    const { asset, tokenDetails } = this.props;
    const { title, summary, target, value, unlimitedApproval, errors } = this.state;

    return (
      <div className={style.self}>
        <Field>
          <Title>Headline</Title>
          <Input name="title" type="text" value={title} onChange={this._onInput} onBlur={this._onInput} />
          <Error>{errors.title}</Error>
        </Field>
        <Field>
          <Title>Description</Title>
          <Input name="summary" type="text" value={summary} onChange={this._onInput} onBlur={this._onInput} />
          <Error>{errors.summary}</Error>
        </Field>
        <Field>
          <Title>Link</Title>
          <Input name="target" type="text" value={target} onChange={this._onInput} onBlur={this._onInput} />
          <Error>{errors.target}</Error>
        </Field>
        <Field>
          <Title>Initial Fee</Title>
          <Input name="value" type="text" value={value} onChange={this._onInput} onBlur={this._onInput} />
          <Error>{errors.value}</Error>
        </Field>
        <Field>
          <p>
            Your balance: {tokenDetails.balanceWithDecimalPoint} {tokenDetails.symbol}.
          </p>
          <Checkbox
            label="Don't ask me again for this token on any website or wherever"
            checked={unlimitedApproval}
            onChange={this._onUnlimitedApprovalChange}
          />
        </Field>
        <TransactionProvider
          startTransaction={this._onSubmit}
          renderReady={() => (
            <Button style={{ width: '100%' }} color="primary">
              Create
            </Button>
          )}
        />
      </div>
    );
  }

  _onInput = (e) => {
    const { value, name } = e.target;
    this.setState(
      {
        [name]: value,
        errors: {
          ...this.state.errors,
          [name]: validate(rules[name], value),
        },
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state);
        }
      },
    );
  }

  _onUnlimitedApprovalChange = (e) => {
    this.setState({ unlimitedApproval: e.target.checked });
  }

  _validateAll = () => {
    const errors = ['title', 'summary', 'target', 'value'].reduce((acc, name) => {
      const validations = validate(rules[name], this.state[name]);
      return !validations ? acc : { ...acc, [name]: validations };
    }, {});
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  _onSubmit = () => {
    if (!this._validateAll()) {
      return;
    }

    const { recipientAddress, web3, tokenDetails } = this.props;
    const { value, unlimitedApproval } = this.state;

    const claim = this._createClaim();
    const token = this._getTokenAddress();
    const toPayWei = toWei(value!, tokenDetails.decimals);

    let sendClaimPromise: Promise<{ promiEvent: PromiEvent<TransactionReceipt> }>;
    if (token) {
      sendClaimPromise = core.ethereum.claims.allowanceUserfeedsContractTokenTransfer(web3, token)
        .then((allowance) => {
          let promise: Promise<any> = Promise.resolve(null);
          if (new BN(allowance).lte(new BN(toPayWei))) {
            promise = core.ethereum.claims.approveUserfeedsContractTokenTransfer(
              web3,
              token,
              unlimitedApproval ? MAX_VALUE_256 : toPayWei,
            ).then(({ promiEvent }) => resolveOnTransationHash(promiEvent));
          }

          return promise.then(() => core.ethereum.claims.sendClaimTokenTransfer(
            web3,
            recipientAddress,
            token,
            value,
            claim,
          ));
        });
    } else {
      sendClaimPromise = core.ethereum.claims.sendClaimValueTransfer(web3, recipientAddress, value, claim);
    }

    sendClaimPromise
      .then(({ promiEvent }) => {
        promiEvent
          .on('transactionHash', (linkId) => {
            this.props.onSuccess(linkId);
          })
          .on('error', (e) => {
            this.props.onError(e.message);
          });
      });
    return sendClaimPromise;
  }

  _createClaim() {
    const { target, title, summary } = this.state;
    const location = locationWithoutQueryParamsIfLinkExchangeApp();

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
