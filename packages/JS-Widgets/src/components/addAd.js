import { h, Component } from 'preact';
import linkState from 'linkstate';

import './addAd.css';

import { sendAdClaim } from '../api';

import Input from './input';
import Loader from './loader';
import Button from './button';

export default class AddAd extends Component {

  render(_, { posting }) {
    return (
      <div class="add-ad">
        <Input placeholder="Title" onInput={linkState(this, 'title')} />
        <Input placeholder="Summary" onInput={linkState(this, 'summary')} />
        <Input placeholder="URL" onInput={linkState(this, 'url')} />
        <Input placeholder="Value" onInput={linkState(this, 'value')} />
        <div class="send-button">
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

    sendAdClaim(title, summary, url, address, value)
      .catch((e) => console.error(e))
      .then(() => {
        this.setState({ posting: false });
        this.props.onFinish();
      });
  };
}
