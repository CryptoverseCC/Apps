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
      algorithm: params.get('algorithm') || 'ads',
      whitelist: params.get('whitelist') || '',
      contextFromParams: params.has('context'),
      whitelistFromParams: params.has('whitelist'),
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
          <TextField
            className={style.input}
            hintText="Whitelist ID"
            floatingLabelText="Whitelist ID"
            value={this.state.whitelist}
            onChange={this._onWhitelistChange}
            disabled={this.state.whitelistFromParams}
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

  _onWhitelistChange = (_, whitelist) => {
    this.setState({ whitelist });
    this._fetchAds();
  };

  _fetchAds = debounce(async () => {
    const { context, algorithm, whitelist } = this.state;

    this.setState({ fetching: true });

    const baseURL = 'https://api.userfeeds.io/ranking';

    try {
      const allAdsRequest = fetch(`${baseURL}/${context}/${algorithm}/`)
        .then((res) => res.json());
      const whitelistedAdsRequest = fetch(`${baseURL}/${context}/${algorithm}/?whitelist=${whitelist}`)
        .then((res) => res.json());

      const [allAds, whitelistedAds] = await Promise.all([allAdsRequest, whitelistedAdsRequest]);

      const ads = allAds.items.map((ad) => {
        const whitelisted = !!whitelistedAds.items.find((a) => ad.id === a.id);

        return { ...ad, whitelisted };
      });
      this.setState({ ads, fetching: false });
    } catch(_) {
      this.setState({ fetching: false });
    }
  }, 500);

  _onAdClick = (ad) => {
    const [_, address] = this.state.whitelist.split(':');
    core.web3.claims.whitelistAd(address, ad.id);
  };
}
