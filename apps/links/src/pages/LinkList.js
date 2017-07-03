import React, { Component } from 'react';

import debounce from 'lodash.debounce';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

import LinkList from '@userfeeds/apps-components/src/LinkList';

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
      contextFromParams: params.has('context'),
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
            hintText="Advertiser ID"
            floatingLabelText="Advertiser ID"
            value={this.state.context}
            onChange={this._onContextChange}
            disabled={this.state.contextFromParams}
          />
          <LinkList links={this.state.links} onItemClick={() => { }} />
          {this.state.fetching && <CircularProgress />}
        </Paper>
      </div>
    );
  }

  _onContextChange = (_, context) => {
    this.setState({ context });
    this._fetchLinks();
  };

  _fetchLinks = debounce(async () => {
    const { context } = this.state;

    this.setState({ fetching: true });
    // https://192.168.99.100/api/ranking/ethereum/claims/?context=rinkeby:0x6bcc5c98e98fc98f91667d4b79cf96ad3bd43155&type=link
    // const fetch_url = 'https://api.userfeeds.io/ranking/ethereum/claims';
    // const fetch_url = `http://0.0.0.0:5000/${context}/claims/?type=ad`;
    const fetch_url = 'https://192.168.99.100/api/ranking/ethereum/claims';

    try {
      const allLinksRequest = fetch(fetch_url)
        .then((res) => res.json());

      const [allLinks] = await Promise.all([allLinksRequest]);

      this.setState({ links: allLinks.items, fetching: false });

      return allLinks;
    } catch (_) {
      this.setState({ fetching: false });
      return null;
    }
  }, 500);

  // _onAdClick = (ad) => {
  //   const [_, address] = this.state.whitelist.split(':');
  //   core.web3.claims.whitelistAd(address, ad.id);
  // };
}
