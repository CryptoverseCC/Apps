import React, { Component } from 'react';

import core from '@userfeeds/core';

import debounce from 'lodash.debounce';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

import AdsList from '@userfeeds/apps-components/src/AdsList';

import style from './Whitelist.scss';

export default class Creator extends Component {

  constructor(props) {
    super(props);

    const params = new URLSearchParams(props.location.search);

    this.state = {
      links: [],
      fetching: false,
      context: params.get('context') || '',
      algorithm: params.get('algorithm') || 'links',
      whitelist: params.get('whitelist') || '',
      contextFromParams: params.has('context'),
      whitelistFromParams: params.has('whitelist'),
    };
  }

  componentWillMount() {
    if (this.state.contextFromParams) {
      this._fetchLinks();
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

          <AdsList ads={this.state.links} onItemClick={this._onLinkClick} />
          {this.state.fetching && <CircularProgress />}
        </Paper>
      </div>
    );
  }

  _onContextChange = (_, context) => {
    this.setState({ context });
    this._fetchLinks();
  };

  _onWhitelistChange = (_, whitelist) => {
    this.setState({ whitelist });
    this._fetchLinks();
  };

  _fetchLinks = debounce(async () => {
    const { context, algorithm, whitelist } = this.state;

    this.setState({ fetching: true });

    const baseURL = 'https://api.userfeeds.io/ranking';

    try {
      const allLinksRequest = fetch(`${baseURL}/${context}/${algorithm}/`)
        .then((res) => res.json());
      const whitelistedLinksRequest = fetch(`${baseURL}/${context}/${algorithm}/?whitelist=${whitelist}`)
        .then((res) => res.json());

      const [allLinks, whitelistedLinks] = await Promise.all([
        allLinksRequest,
        whitelistedLinksRequest,
      ]);

      const links = allLinks.items.map((link) => {
        const whitelisted = !!whitelistedLinks.items.find((a) => link.id === a.id);

        return { ...link, whitelisted };
      });
      this.setState({ links, fetching: false });
    } catch (_) {
      this.setState({ fetching: false });
    }
  }, 500);

  _onLinkClick = (link) => {
    const [_, address] = this.state.whitelist.split(':');
    const claim = {
      claim: { target: `userfeeds:claim:${link.id}` },
      credits: [{
        type: 'interface',
        value: window.location.href,
      }],
    };

    core.ethereum.claims.sendClaim(address, claim);
  };
}
