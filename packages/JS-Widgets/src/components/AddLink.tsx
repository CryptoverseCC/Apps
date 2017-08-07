import { h, Component } from 'preact';

import * as core from '@userfeeds/core';

import Input from './Input';
import Loader from './Loader';
import Button from './Button';

import * as style from './addLink.scss';

interface IAddLinkProps {
  context: string;
  onSuccess(linkId: string): void;
  onError(error: any): void;
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
  value: [R.required, R.number, R.value((v: number) => v > 0, 'Have to be positive value')],
};

export default class AddLink extends Component<IAddLinkProps, IAddLinkState> {

  state = {
    title: '',
    summary: '',
    url: '',
    value: '',
    errors: {},
  };

  render(_, { posting, title, summary, url, value, errors }) {
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
          type="number"
          errorMessage={errors.value}
          onBlur={this._onInputEvent}
          onInput={this._onInputEvent}
        />
        <div class={style.sendButton}>
          {posting
            ? <Loader />
            : <Button onClick={this._onSubmit}>Send</Button>
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
        this.setState({ posting: false });
        this.props.onSuccess(linkId);
      })
      .catch((e: Error) => {
        this.props.onError(e.message);
      });
  }
}
