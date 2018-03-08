import React, { Component } from 'react';
import qs from 'qs';
import Web3 from 'web3';

import { getInfura } from '@linkexchange/utils/web3';
import TokenDetailsProvider from '@linkexchange/token-details-provider';
import { IWidgetSettings } from '@linkexchange/types/widget';
import { IRemoteLink, ILink } from '@linkexchange/types/link';
import { throwErrorOnNotOkResponse } from '@linkexchange/utils/fetch';
import calculateProbabilities from '@linkexchange/utils/links';

import Link from './components/Link';
import LinkProvider from './containers/LinkProvider';

interface IProps {
  location: Location;
}

interface IState {
  widgetSettings: IWidgetSettings;
  position?: 'bottom' | 'top';
  fetched: boolean;
  links: ILink[];
  linkDuration?: number;
  currentLink?: ILink;
}

export default class Widget extends Component<IProps, IState> {
  lastFetchTime: number = 0;
  infura: Web3;

  constructor(props: IProps) {
    super(props);
    const { position, ...widgetSettings } = qs.parse(props.location.search.replace('?', ''));
    const [network] = widgetSettings.asset.split(':');
    this.infura = getInfura(network);

    this.state = {
      widgetSettings,
      position: position || 'bottom',
      fetched: false,
      links: [],
    };
  }

  componentDidMount() {
    this._fetchLinks();
  }

  timeslot = () => {
    const { timeslot = 20 } = this.state.widgetSettings;
    return timeslot * 1000;
  };

  render() {
    const { currentLink, linkDuration, links, position, fetched, widgetSettings } = this.state;

    if (!fetched) {
      return null;
    }

    return (
      <div>
        <TokenDetailsProvider
          web3={this.infura}
          asset={widgetSettings.asset}
          render={(tokenDetails) => (
            <Link
              link={currentLink}
              linkDuration={linkDuration!}
              tokenSymbol={tokenDetails.symbol}
              position={position}
            />
          )}
        />
        <LinkProvider links={links} onLink={this._onLink} timeslot={this.timeslot()} />
      </div>
    );
  }

  _fetchLinks = async () => {
    const start = new Date();
    const {
      apiUrl = 'https://api.userfeeds.io',
      recipientAddress,
      asset,
      algorithm,
      whitelist,
    } = this.state.widgetSettings;

    // tslint:disable-next-line max-line-length
    const rankingApiUrl = `${apiUrl}/ranking/${algorithm};asset=${asset.toLowerCase()};context=${recipientAddress.toLowerCase()}/`;
    const timedecayFilterAlgorithm = algorithm === 'links' ? 'filter_timedecay/' : '';
    const whitelistFilterAlgorithm = whitelist ? `filter_whitelist;whitelist=${whitelist.toLowerCase()}/` : '';
    const groupFilterAlgorithm = 'filter_group;sum_keys=score;sum_keys=total/';
    let links: IRemoteLink[] = [];

    try {
      // tslint:disable-next-line max-line-length
      const { items = [] } = await fetch(
        `${rankingApiUrl}${timedecayFilterAlgorithm}${whitelistFilterAlgorithm}${groupFilterAlgorithm}`,
      )
        .then(throwErrorOnNotOkResponse)
        .then<{ items: IRemoteLink[] }>((res) => res.json());
      links = items.slice(0, this.state.widgetSettings.slots);
    } catch (e) {
      console.info('Something went wrong 😞');
    }
    const duration = new Date().getTime() - start.getTime();
    setTimeout(() => {
      this.setState({
        fetched: true,
        links: calculateProbabilities(links),
      });
    }, 2 * this.lastFetchTime - duration);
    setTimeout(this._fetchLinks, this.timeslot() * 1000 - 2 * duration);
    this.lastFetchTime = duration;
  };

  _onLink = (currentLink: ILink, duration: number) => {
    this.setState({ currentLink, linkDuration: duration });
  };
}
