import { h, Component } from 'preact';

import * as core from '@userfeeds/core';

import { ILink } from '../types';

import Input from './Input';
import Loader from './Loader';
import Button from './Button';
import Tooltip from './Tooltip';

import * as style from './addLink.scss';

interface IAddLinkProps {
  context: string;
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
  url: string;
  value: string;
  errors: {
    title?: string;
    summary?: string;
    url?: string;
    value?: string;
  };
  posting?: boolean;
}

const R = {
  required: (name, value) =>
    value.toString().trim() ? '' : `Field ${name} is required`,
  maxLength: (n: number) =>
    (name, value: string) => value.length <= n ? '' : `${name} have to be shorter than ${n} characters`,
  number: (name, value) =>
    !isNaN(parseFloat(value)) && isFinite(value) ? '' : `${name} have to be number`,
  value: (validator: (v: number | string) => boolean, reason: string) =>
    (name, value) => validator(value) ? '' : reason,
};

const httpRegExp = /^https?:\/\//;

const rules = {
  title: [R.required, R.maxLength(35)],
  summary: [R.required, R.maxLength(70)],
  url: [R.required, R.value((v: string) => httpRegExp.test(v), 'Have to be valid url')],
  value: [R.required, R.number, R.value((v: number) => v > 0, 'Cannot be negative'),
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
    url: '',
    value: '',
    errors: {},
  };

  render(
    { web3State }: IAddLinkProps,
    { posting, title, summary, url, value, errors }: IAddLinkState) {
    return (
      <div class={style.self}>
        <Input
          name="title"
          placeholder="Title"
          value={title}
          errorMessage={errors.title}
          onBlur={this._onInputEvent}
          onInput={this._onInputEvent}
        />
        <Input
          placeholder="Summary"
          name="summary"
          value={summary}
          errorMessage={errors.summary}
          onBlur={this._onInputEvent}
          onInput={this._onInputEvent}
        />
        <Input
          placeholder="URL"
          name="url"
          value={url}
          errorMessage={errors.url}
          onBlur={this._onInputEvent}
          onInput={this._onInputEvent}
        />
        <Input
          placeholder="Value"
          value={value}
          name="value"
          errorMessage={errors.value}
          onBlur={this._onInputEvent}
          onInput={this._onInputEvent}
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

  _onInputEvent = (e) => {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: this._validate(name, value),
      },
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state);
      }
    });
  }

  _validate = (name, value) => {
    if (!rules[name]) {
      return undefined;
    }
    const validationResult = rules[name].map((r) => r(name, value)).filter((v) => !!v);

    return validationResult[0];
  }

  _validateAll = () => {
    const errors = ['title', 'summary', 'url', 'value']
      .map((name) => ({ [name]: this._validate(name, this.state[name])}))
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

    const { context } = this.props;
    const { title, summary, url, value } = this.state;
    this.setState({ posting: true });

    const [_, address] = context.split(':');

    const claim = {
      type: ['link'],
      claim: { target: url, title, summary },
      credits: [{
        type: 'interface',
        value: window.location.href,
      }],
    };

    core.ethereum.claims.sendClaim(address, claim, value)
      .then((linkId) => {
        this.props.onSuccess(linkId);
      })
      .catch((e: Error) => {
        this.props.onError(e.message);
      })
      .then(() => this.setState({ posting: false }));
  }
}
