import React, { Component } from 'react';
import debounce from 'lodash.debounce';

import Input from '@userfeeds/apps-components/src/Input';
import Paper from '@userfeeds/apps-components/src/Paper';
import LinkListComponent from '@userfeeds/apps-components/src/LinkList';

import * as style from './Whitelist.scss';

interface ILinkListProps {
  location: any;
}

interface ILinkListState {
  links: any[];
  fetching: boolean;
  asset: string;
  creatorAddress: string;
  creatorAddressFromParams: boolean;
  algorithm: string;
}

export default class LinkList extends Component<ILinkListProps, ILinkListState> {

  constructor(props) {
    super(props);

    const params = new URLSearchParams(props.location.search);

    this.state = {
      links: [],
      fetching: false,
      asset: params.get('asset'),
      creatorAddress: params.get('creatorAddress') || '',
      algorithm: params.get('algorithm') || 'links',
      creatorAddressInParams: params.has('creatorAddress'),
    };
  }

  componentWillMount() {
    if (this.state.creatorAddressInParams) {
      this._fetchLinks();
    }
  }

  render() {
    return (
      <div className={style.self}>
        <Paper className={style.paper}>
          <Input
            placeholder="Advertiser ID"
            value={this.state.creatorAddress}
            onInput={this._onCreatorAddressChange}
            disabled={this.state.creatorAddressInParams}
          />
          <LinkListComponent links={this.state.links} />
        </Paper>
      </div>
    );
  }

  _onCreatorAddressChange = (e) => {
    this.setState({ creatorAddress: e.target.value });
    this._fetchLinks();
  }

  _fetchLinks = debounce(async () => {
    const { asset, creatorAddress } = this.state;

    this.setState({ fetching: true });
    const fetchUrl = 'https://api.userfeeds.io/ranking';

    try {
      const allLinksRequest = fetch(`${fetchUrl}/${asset}:${creatorAddress}/authored/?type=link`)
        .then((res) => res.json());

      const [allLinks] = await Promise.all([allLinksRequest]);

      this.setState({ links: allLinks.items, fetching: false });

      return allLinks;
    } catch (_) {
      this.setState({ fetching: false });
      return null;
    }
  }, 500);
}
