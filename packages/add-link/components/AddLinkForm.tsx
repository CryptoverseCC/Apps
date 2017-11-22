import React, { Component } from 'react';

import core from '@userfeeds/core/src';
import web3 from '@linkexchange/utils/web3';
import { IBaseLink } from '@linkexchange/types/link';
import Loader from '@linkexchange/components/src/Loader';
import Tooltip from '@linkexchange/components/src/Tooltip';
import Input from '@linkexchange/components/src/Form/Input';
import Button from '@linkexchange/components/src/NewButton';
import Checkbox from '@linkexchange/components/src/Checkbox';
import { R, validate } from '@linkexchange/utils/validation';
import Web3StateProvider from '@linkexchange/web3-state-provider';
import TokenDetailsProvider from '@linkechange/token-details-provider';
import Field, { Title, Error } from '@linkexchange/components/src/Form/Field';

import {
  locationWithoutQueryParamsIfLinkExchangeApp,
} from '@linkexchange/utils/locationWithoutQueryParamsIfLinkExchangeApp';

import * as style from './addLinkForm.scss';

interface IAddLinkFormProps {
  asset: string;
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
    const { asset } = this.props;
    const { posting, title, summary, target, value, unlimitedApproval, errors } = this.state;
    const [desiredNetwork] = asset.split(':');

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
            desiredNetwork={desiredNetwork}
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
