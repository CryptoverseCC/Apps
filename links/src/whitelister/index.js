import React, { Component } from 'react';

import core from '@userfeeds/core';

import debounce from 'lodash.debounce';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

import AdsList from '../components/AdsList';

import style from './index.scss';

export default class Creator extends Component {

  constructor(props) {
    super(props);

    const params = (new URL(window.location)).searchParams;

    this.state = {
      ads: [],
      fetching: false,
      context: params.get('context') || '',
      contextFromParams: params.has('context'),
    };
  }

  componentWillMount() {
    if (this.state.contextFromParams) {
      this._fetchAds();
    }
  }

  render() {
    return (
      <div className={style.this}>
        <Paper className={style.paper}>
          <TextField
            className={style.input}
            hintText="Userfeed ID"
            floatingLabelText="Userfeed ID"
            value={this.state.context}
            onChange={this._onContextChange}
            disabled={this.state.contextFromParams}
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
