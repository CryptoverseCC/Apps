import { h, Component } from 'preact';

import * as core from '@userfeeds/core';

import * as style from './bidLink.scss';

import Input from './input';
import Button from './button';
import TextWithLabel from './textWithLabel';

interface IBidLinkProps {
  link: any;
  links: Array<any>;
  context: string;
  onSuccess?(linkId: string): void;
  onFinish?(): void;
  onError?(): void;
}

interface IBidLinkState {
  sum: number;
  value?: string;
  probability: string;
}

export default class BidLink extends Component<IBidLinkProps, IBidLinkState> {

  constructor(props: IBidLinkProps) {
    super(props);

    this.state = {
      sum: props.links.reduce((acc, { score }) => acc + score, 0),
      probability: '-',
    };
  }

  render({ link, onFinish }: IBidLinkProps, { value, probability }: IBidLinkState) {
    return (
      <div class={style.self}>
        <div class={style.inputRow}>
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
          onClick={this._onSendClick}
        >
          Send
        </Button>
      </div>
    );
  }

  _onValueChange = (event) => {
    this.setState({ value: event.target.value });

    const { link } = this.props;
    const { sum } = this.state;
    const valueInEth = parseFloat(event.target.value);

    if (valueInEth) {
      const valueInWei = parseFloat(web3.toWei(valueInEth, 'ether'));
      let rawProbability = (link.score + valueInWei) / (sum + valueInWei);
      const probability = (100 * rawProbability).toFixed(2);
      this.setState({ probability });
    } else {
      this.setState({ probability: '-' });
    }
  };

  _onSendClick = () => {
    const { context } = this.props;
    const { title, summary, target } = this.props.link;
    const { value } = this.state;

    const [_, address] = context.split(':');

    core.web3.claims.addAd(address, target, title, summary, value)
      .then(this.props.onSuccess)
      .catch((e) => {
        console.log(e);
        if (this.props.onError) {
          this.props.onError();
        }
      });
  };
}
