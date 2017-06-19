import { h, Component } from 'preact';

import './bidAd.css';

import { sendAdClaim } from '../api';

import Input from './input';
import Button from './button';
import TextWithLabel from './textWithLabel';

export default class BidAd extends Component {

  constructor(props) {
    super(props);

    this.state = {
      sum: props.ads.reduce((acc, { score }) => acc + score, 0),
      probability: '-',
    };
  }

  render({ ad, onFinish }, { value, probability }) {
    return (
      <div class="bid-ad">
        <div class="input-row">
          <Input
            placeholder="Value"
            value={value}
            onInput={this._onValueChange}
          />
          <p>=</p>
          <TextWithLabel
            label="Estimated Probability"
            text={`${probability} %`}
          />
        </div>
        <Button
          disabled={probability === '-'}
          style={{ marginLeft: 'auto' }}
          onClick={this._onSendCick}
        >
          Send
        </Button>
      </div>
    );
  }

  _onValueChange = (event) => {
    this.setState({ value: event.target.value });

    const { ad } = this.props;
    const { sum } = this.state;
    const value = parseFloat(event.target.value);

    if (value) {
      const probability = ((ad.score + value) / (sum + value) * 100).toFixed(2);
      this.setState({ probability });
    } else {
      this.setState({ probability: '-' });
    }
  };

  _onSendCick = () => {
    const { context } = this.props;
    const { title, summary, url } = this.props.ad;
    const { value } = this.state;

    const [_, address] = context.split(':');

    sendAdClaim(title, summary, url, address, value)
      .catch((e) => console.log(e))
      .then(this.props.onFinish);
  };
}
