import React, { Component } from 'react';

import Paper from 'material-ui/Paper';

import AdsList from './AdsList';

import './Creator.css';

export default class Creator extends Component {

  state = {
    ads: [],
  };

  componentWillMount() {
    fetch(`https://api.userfeeds.io/ranking/${this.props.context}/ads/`)
      .then((res) => res.json())
      .then(({ items: ads }) => this.setState({ ads }));
  }

  render() {
    return (
      <div className="Creator-container">
        <Paper className="Creator-paper">
          <AdsList ads={this.state.ads} onItemClick={this._onAdClick} />
        </Paper>
      </div>
    );
  }

  _onAdClick = (ad) => {
    console.log('_onAdClick');
    const web3 = window.web3;

    const abi = [{
      constant: false,
      inputs: [
        { name: 'userfeed', type: 'address' },
        { name: 'data', type: 'string' },
      ],
      name: 'post',
      outputs: [],
      payable: true,
      type: 'function',
    }, {
      anonymous: false,
      inputs: [
        { indexed: false, name: 'sender', type: 'address' },
        { indexed: false, name: 'userfeed', type: 'address' },
        { indexed: false, name: 'data', type: 'string' },
      ],
      name: 'Claim',
      type: 'event',
    }];

    const claim = {
      type: ['whitelist'],
      claim: {
        target: ad.id,
      },
      credits: [{
        type: 'interface',
        value: window.location.href,
      }],
    };

    const contractAddress = '0x0a48ac8263d9d79768d10cf9d7e82a19c49f0002';
    const contract = web3.eth.contract(abi).at(contractAddress);

    contract.post(ad.id, JSON.stringify(claim), {value: web3.toWei(0, 'ether')}, () => {
    });
  };
}
