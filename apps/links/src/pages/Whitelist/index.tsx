import React, { Component } from 'react';
import debounce from 'lodash.debounce';

import core from '@userfeeds/core/src';
import web3 from '@userfeeds/utils/src/web3';

import Input from '@userfeeds/apps-components/src/Input';
import Paper from '@userfeeds/apps-components/src/Paper';
import LinksList from './components/LinksList';

import * as style from './whitelist.scss';

interface IWhitelistProps {
  location: any;
}

interface IWhitelistState {
  links: any[];
  fetching: boolean;
  asset: string;
  assetFromParams: boolean;
  recipientAddress: string;
  algorithm: string;
  whitelist: string;
  recipientAddressFromParams: boolean;
  whitelistFromParams: boolean;
}

export default class Creator extends Component<IWhitelistProps, IWhitelistState> {

  constructor(props) {
    super(props);

    const params = new URLSearchParams(props.location.search);

    this.state = {
      links: [],
      fetching: false,
      asset: params.get('asset') || '',
      recipientAddress: params.get('recipientAddress') || '',
      algorithm: params.get('algorithm') || 'links',
      whitelist: params.get('whitelist') || '',
      recipientAddressFromParams: params.has('recipientAddress'),
      whitelistFromParams: params.has('whitelist'),
      assetFromParams: params.has('asset'),
    };
  }

  componentWillMount() {
    if (this.state.recipientAddressFromParams) {
      this._fetchLinks();
    }
  }

  render() {
    return (
      <div className={style.self}>
        <Paper className={style.paper}>
          <Input
            placeholder="Asset"
            value={this.state.asset}
            onInput={this._onChange('asset')}
            disabled={this.state.assetFromParams}
          />
          <Input
            placeholder="Recipient Address"
            value={this.state.recipientAddress}
            onInput={this._onChange('recipientAddress')}
            disabled={this.state.recipientAddressFromParams}
          />
          <Input
            placeholder="Whitelist"
            value={this.state.whitelist}
            onInput={this._onChange('whitelist')}
            disabled={this.state.whitelistFromParams}
          />
          <LinksList links={this.state.links} onItemClick={this._onLinkClick} />
        </Paper>
      </div>
    );
  }

  _onChange = (fieldName) => (e) => {
    this.setState({ [fieldName]: e.target.value });
    this._fetchLinks();
  }

  _fetchLinks = debounce(async () => {
    const { recipientAddress, algorithm, whitelist, asset } = this.state;

    this.setState({ fetching: true });

    const baseURL = 'https://api.userfeeds.io/ranking';

    try {
      const allLinksRequest = fetch(`${baseURL}/${asset}:${recipientAddress}/${algorithm}/`)
        .then((res) => res.json());
      const whitelistParam = whitelist ? `?whitelist=${asset}:${whitelist}` : '';
      const whitelistedLinksRequest = fetch(`${baseURL}/${asset}:${recipientAddress}/${algorithm}/${whitelistParam}`)
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
    const claim = {
      claim: { target: link.id },
    };
    
    core.ethereum.claims.sendClaimWithoutValueTransfer(web3, claim);
  }
}
