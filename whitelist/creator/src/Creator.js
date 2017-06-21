import React, { Component } from 'react';

import core from '@userfeeds/core';

import debounce from 'lodash.debounce';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

import AdsList from './AdsList';

import './Creator.css';

export default class Creator extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ads: [],
      fetching: false,
      context: props.context || '',
      contextFromProps: !!props.context,
    };
  }

  componentWillMount() {
    if (this.state.contextFromProps) {
      this._fetchAds();
    }
  }

  render() {
    return (
      <div className="Creator-container">
        <Paper className="Creator-paper">
          <TextField
            hintText="Userfeed ID"
            floatingLabelText="Userfeed ID"
            value={this.state.context}
            onChange={this._onContextChange}
            disabled={this.state.contextFromProps}
          />
          <AdsList ads={this.state.ads} onItemClick={this._onAdClick} />
          {this.state.fetching && <CircularProgress /> }
        </Paper>
      </div>
    );
  }

  _onContextChange = (_, context) => {
    this.setState({ context });
    this._fetchAds();
  };

  _fetchAds = debounce((context) => {
    this.setState({ fetching: true });
    fetch(`https://api.userfeeds.io/ranking/${this.state.context}/ads/`)
      .then((res) => res.json())
      .then(({ items: ads }) => this.setState({ ads, fetching: false }))
      .catch(() => this.setState({ fetching: false }));
  }, 500);

  _onAdClick = (ad) => {
    const [_, address] = this.context.split(':');
    core.web3.claims.whitelistAd(address, ad.id);
  };
}
