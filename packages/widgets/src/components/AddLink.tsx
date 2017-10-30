import React, { Component } from 'react';

import core from '@userfeeds/core/src';
import Input from '@userfeeds/apps-components/src/Form/Input';
import Field, { Title, Error } from '@userfeeds/apps-components/src/Form/Field';
import Button from '@userfeeds/apps-components/src/NewButton';
import Loader from '@userfeeds/apps-components/src/Loader';
import Tooltip from '@userfeeds/apps-components/src/Tooltip';
import Checkbox from '@userfeeds/apps-components/src/Checkbox';
import { IBaseLink } from '@userfeeds/types/link';
import web3 from '@userfeeds/utils/src/web3';
import { R, validate } from '@userfeeds/utils/src/validation';

import Web3StateProvider from './Web3StateProvider';
import { locationWithoutQueryParamsIfLinkExchangeApp } from '../utils/locationWithoutQueryParamsIfLinkExchangeApp';

import * as style from './addLink.scss';
import TokenDetailsProvider from './TokenDetailsProvider';

interface IAddLinkProps {
  asset: string;
  recipientAddress: string;
  onSuccess(linkId: string): void;
  onError(error: any): void;
  onChange?: (link: IBaseLink) => void;
}

interface IAddLinkState {
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
  posting?: boolean;
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

export default class AddLink extends Component<IAddLinkProps, IAddLinkState> {
  state: IAddLinkState = {
    title: '',
    summary: '',
    target: 'http://',
    value: '',
    unlimitedApproval: false,
    errors: {},
  };

  render() {
    const { posting, title, summary, target, value, unlimitedApproval, errors } = this.state;

    return (
      <div className={style.self} style={{ width: '600px' }}>
        <Field>
          <Title>Headline</Title>
          <Input name="title" type="text" value={title} onChange={this._onInput} onBlur={this._onInput} />
          <Error>{errors.title}</Error>
        </Field>
        <Field>
          <Title>Description</Title>
          <Input multiline name="summary" type="text" value={summary} onChange={this._onInput} onBlur={this._onInput} />
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
          {this._getTokenAddress() && [
            <TokenDetailsProvider
              render={(tokenDetails) => (
                <p>
                  Your balance: {tokenDetails.balanceWithDecimalPoint} {tokenDetails.symbol}.
                </p>
              )}
            />,
            <Checkbox
              label="Don't ask me again for this token on any website or wherever"
              checked={unlimitedApproval}
              onChange={this._onUnlimitedApprovalChange}
            />,
          ]}
        </Field>
        {posting ? (
          <div style={{ margin: '0 auto' }}>
            <Loader />
          </div>
        ) : (
          <Web3StateProvider
            render={({ enabled, reason }) => (
              <Tooltip text={reason}>
                <Button style={{ width: '100%' }} color="primary" disabled={!enabled} onClick={this._onSubmit}>
                  Create
                </Button>
              </Tooltip>
            )}
          />
        )}
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

    const { recipientAddress } = this.props;
    const { value, unlimitedApproval } = this.state;
    this.setState({ posting: true });

    const claim = this._createClaim();
    const token = this._getTokenAddress();
    let sendClaimPromise;
    if (token) {
      sendClaimPromise = core.ethereum.claims.sendClaimTokenTransfer(
        web3,
        recipientAddress,
        token,
        value,
        unlimitedApproval,
        claim,
      );
    } else {
      sendClaimPromise = core.ethereum.claims.sendClaimValueTransfer(web3, recipientAddress, value, claim);
    }
    sendClaimPromise
      .then((linkId) => {
        this.props.onSuccess(linkId);
      })
      .catch((e: Error) => {
        this.props.onError(e.message);
      })
      .then(() => this.setState({ posting: false }));
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
