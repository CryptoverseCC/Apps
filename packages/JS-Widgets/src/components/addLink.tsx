import { h, Component } from 'preact';
import linkState from 'linkstate';

import * as core from '@userfeeds/core';

import Input from './input';
import Loader from './loader';
import Button from './button';

import * as style from './addLink.scss';

interface IAddLinkProps {
  context: string;
  onSuccess(linkId: string): void;
  onError(): void;
}

interface IAddLinkState {
  title: string;
  summary: string;
  url: string;
  value: string;
  posting?: boolean;
}

export default class AddLink extends Component<IAddLinkProps, IAddLinkState> {

  state = {
    title: '',
    summary: '',
    url: '',
    value: '',
  };

  render(_, { posting, title, summary, url, value }) {
    return (
      <div class={style.self}>
        <Input
          placeholder="Title"
          value={title}
          onInput={linkState(this, 'title')}
        />
        <Input
          placeholder="Summary"
          value={summary}
          onInput={linkState(this, 'summary')}
        />
        <Input
          placeholder="URL"
          value={url}
          onInput={linkState(this, 'url')}
        />
        <Input
          placeholder="Value"
          value={value}
          onInput={linkState(this, 'value')}
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

  _onSubmit = () => {
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
      .catch((e) => {
        this.props.onError();
      });
  }
}
