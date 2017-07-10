import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';
import core from '@userfeeds/core';

import LinkPreview from './Link';

import style from './LinkDetails.scss';

export default class LinkDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bidding: false,
      value: '',
      probability: '-',
      sum: props.links.reduce((acc, { score }) => acc + score, 0),
    };
  }

  render() {
    const { link, position } = this.props;
    const { bidding, probability } = this.state;

    if (bidding) {
      return (
        <div className={style.this}>
          <div className={style.row}>
            <TextField
              hintText="Value"
              floatingLabelText="Value"
              className={style.input}
              onChange={this._onValueChange}
            />
            <p>=</p>
            <TextWithLabel
              label="Estimated Probability"
              text={`${probability} %`}
            />
          </div>
          <RaisedButton
            label="Bid"
            disabled={probability === '-'}
            style={{ marginLeft: 'auto' }}
            onTouchTap={this._sendBid}
          />
        </div>
      );
    }
    return (
      <div className={style.this}>
        <LinkPreview link={link} />
        <RaisedButton
          className={style.bid}
          label="⇈ Bid Link"
          onTouchTap={this._onBidClick}
        />
        <div className={style.footer}>
          <TextWithLabel label="Current Ranking Position" text={position} />
          <TextWithLabel label="Created" text={'25-05-2017'} />
          <TextWithLabel label="Last bid" text={'26-05-2017'} />
        </div>
      </div>
    );
  }
  _onValueChange = (_, rawValue) => {
    this.setState({ value: rawValue });

    const { link } = this.props;
    const { sum } = this.state;
    const value = parseFloat(web3.toWei(rawValue));

    if (value > 0) {
      const probability = (((link.score + value) / (sum + value)) * 100).toFixed(2);
      this.setState({ probability });
    } else {
      this.setState({ probability: '-' });
    }
  };

  _sendBid = () => {
    const { context } = this.props;
    const { title, summary, target } = this.props.link;
    const { value } = this.state;

    const [_, address] = context.split(':');

    const claim = {
      type: ['link'],
      claim: { target, title, summary },
      credits: [{
        type: 'interface',
        value: window.location.href,
      }],
    };

    core.ethereum.claims.sendClaim(address, claim, value)
      .catch((e) => console.log(e))
      .then(() => this.setState({ bidding: false }));
  };

  _onBidClick = () => {
    this.setState({ bidding: true });
  };
}

