import { h, Component } from 'preact';

import core from '@userfeeds/core';

import debounce from 'lodash.debounce';

import Input from '@userfeeds/apps-components/src/Input';
import Paper from '@userfeeds/apps-components/src/Paper';
import AdsList from '@userfeeds/apps-components/src/AdsList';

import * as style from './Whitelist.scss';

interface IWhitelistProps {
  location: any;
}

interface IWhitelistState {
  links: any[];
  fetching: boolean;
  context: string;
  algorithm: string;
  whitelist: string;
  contextFromParams: boolean;
  whitelistFromParams: boolean;
}

export default class Creator extends Component<IWhitelistProps, IWhitelistState> {

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
      <div class={style.self}>
        <Paper class={style.paper}>
          <Input
            placeholder="Userfeed ID"
            value={this.state.context}
            onChange={this._onContextChange}
            disabled={this.state.contextFromParams}
          />
          <Input
            placeholder="Whitelist ID"
            value={this.state.whitelist}
            onChange={this._onWhitelistChange}
            disabled={this.state.whitelistFromParams}
          />

          <AdsList ads={this.state.links} onItemClick={this._onLinkClick} />
        </Paper>
      </div>
    );
  }

  _onContextChange = (e) => {
    this.setState({ context: e.target.value });
    this._fetchLinks();
  }

  _onWhitelistChange = (e) => {
    this.setState({ whitelist: e.target.value });
    this._fetchLinks();
  }

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
      claim: { target: link.id },
      credits: [{
        type: 'interface',
        value: window.location.href,
      }],
    };

    core.ethereum.claims.sendClaim(address, claim);
  }
}
