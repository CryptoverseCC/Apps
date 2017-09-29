import { h, Component } from 'preact';

import * as core from '@userfeeds/core';
import Input from '@userfeeds/apps-components/src/Input';
import Button from '@userfeeds/apps-components/src/Button';
import Loader from '@userfeeds/apps-components/src/Loader';
import Tooltip from '@userfeeds/apps-components/src/Tooltip';

import { ILink } from '../types';

import { R, validate } from '../utils/validation';
import web3 from '../utils/web3';

import * as style from './addLink.scss';

interface IAddLinkProps {
  recipientAddress: string;
  web3State: {
    enabled: boolean;
    reason?: string;
  };
  onSuccess(linkId: string): void;
  onError(error: any): void;
  onChange?: (link: ILink) => void;
}

interface IAddLinkState {
  title: string;
  summary: string;
  target: string;
  value: string;
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
    R.value((v: string) => httpRegExp.test(v), 'Have to start with http(s)://'),
    R.value((v: string) => urlRegExp.test(v), 'Have to be valid url'),
  ],
  value: [R.required, R.number, R.value((v: number) => v >= 0, 'Cannot be negative'),
    R.value((v: string) => {
      const dotIndex = v.indexOf('.');
      if (dotIndex !== -1) {
        return v.length - 1 - dotIndex <= 18;
      }
      return true;
    }, 'Invalid value')],
};

export default class AddLink extends Component<IAddLinkProps, IAddLinkState> {

  state: IAddLinkState = {
    title: '',
    summary: '',
    target: 'http://',
    value: '',
    errors: {},
  };

  render(
    { web3State }: IAddLinkProps,
    { posting, title, summary, target, value, errors }: IAddLinkState) {
    return (
      <div class={style.self}>
        <Input
          name="title"
          placeholder="Title"
          value={title}
          errorMessage={errors.title}
          onBlur={this._onInput}
          onInput={this._onInput}
        />
        <Input
          placeholder="Summary"
          name="summary"
          value={summary}
          errorMessage={errors.summary}
          onBlur={this._onInput}
          onInput={this._onInput}
        />
        <Input
          placeholder="URL"
          name="target"
          value={target}
          errorMessage={errors.target}
          onBlur={this._onInput}
          onInput={this._onInput}
        />
        <Input
          placeholder="Value"
          value={value}
          name="value"
          errorMessage={errors.value}
          onBlur={this._onInput}
          onInput={this._onInput}
        />
        <div class={style.sendButton}>
          {posting
            ? <Loader />
            : (
                <Tooltip text={web3State.reason}>
                  <Button disabled={!web3State.enabled} onClick={this._onSubmit}>Send</Button>
                </Tooltip>
              )
          }
        </div>
      </div>
    );
  }

  _onInput = (e) => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: validate(rules[name], value),
      },
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state);
      }
    });
  }

  _validateAll = () => {
    const errors = ['title', 'summary', 'target', 'value']
      .map((name) => ({ [name]: validate(rules[name], this.state[name])}))
      .reduce((acc, r) => ({ ...acc, ...r}), {});

    return errors;
  }

  _onSubmit = () => {
    const errors = this._validateAll();
    const valid = Object.values(errors).filter((v) => !!v).length === 0;
    if (!valid) {
      this.setState({ errors });
      return;
    }

    const { asset, recipientAddress } = this.props;
    const { title, summary, target, value } = this.state;
    this.setState({ posting: true });

    const claim = {
      type: ['link'],
      claim: { target, title, summary },
      credits: [{
        type: 'interface',
        value: window.location.href,
      }],
    };
    const [, token] = asset.split(':');
    let sendClaimPromise;
    if (typeof token == 'undefined') {
      sendClaimPromise = core.ethereum.claims.sendClaimValueTransfer(web3, recipientAddress, value, claim);
    } else {
      sendClaimPromise = core.ethereum.erc20.erc20ContractDecimals(web3, token).then((decimals) => {
        const valueAsInt = Math.floor(value * Math.pow(10, decimals));
        return core.ethereum.claims.approveUserfeedsContractTokenTransfer(web3, token, valueAsInt)
          .then((s) => core.ethereum.claims.sendClaimTokenTransfer(web3, recipientAddress, token, valueAsInt, claim));
      });
    }
    sendClaimPromise
      .then((linkId) => { this.props.onSuccess(linkId); })
      .catch((e: Error) => { this.props.onError(e.message); })
      .then(() => this.setState({ posting: false }));
  }
}
