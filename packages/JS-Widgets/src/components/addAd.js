import { h, Component } from 'preact';
import linkState from 'linkstate';

import core from '@userfeeds/core';

import style from './addAd.scss';

import Input from './input';
import Loader from './loader';
import Button from './button';

export default class AddAd extends Component {

  state = {
    title: '',
    summary: '',
    url: '',
    value: '',
  };

  render(_, { posting, title, summary, url, value }) {
    return (
      <div class={style.this}>
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
          { posting
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

    core.web3.claims.addAd(address, url, title, summary, value)
      .then(() => {
        this.setState({ posting: false });
        this.props.onSuccess();
      })
      .catch((e) => {
        console.warn(e);
        this.props.onError();
      });
  };
}
