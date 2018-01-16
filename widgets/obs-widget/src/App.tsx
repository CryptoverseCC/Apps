import React, { Component } from 'react';

import { IWidgetSettings } from '@linkexchange/types/widget';
import { IRemoteLink, ILink } from '@linkexchange/types/link';
import { throwErrorOnNotOkResponse } from '@linkexchange/utils/fetch';
import calculateProbabilities from '@linkexchange/utils/links';

import Link from './components/Link';
import LinkProvider from './containers/LinkProvider';

interface IAppProps {
  widgetSettings: IWidgetSettings;
}

interface IAppState {
  fetched: boolean;
  links: ILink[];
  currentLink?: ILink;
}

const timeslot = 20 * 1000;

export default class App extends Component<IAppProps, IAppState> {

  lastFetchTime: number = 0;
  state: IAppState = {
    fetched: false,
    links: [],
  };

  componentDidMount() {
    this._fetchLinks();
  }

  render() {
    const { currentLink, links, fetched } = this.state;

    if (!fetched) {
      return null;
    }

    return (
      <div>
        {currentLink && <Link link={currentLink} tokenSymbol="BEN" />}
        <LinkProvider
          links={links}
          onLink={this._onLink}
          timeslot={timeslot}
        />
      </div>
    );
  }

  _fetchLinks = async () => {
    const start = new Date();
    const {
      apiUrl = 'https://api-staging.userfeeds.io',
      recipientAddress,
      asset,
      algorithm,
      whitelist,
    } = this.props.widgetSettings;
    const rankingApiUrl =
      `${apiUrl}/ranking/${algorithm};asset=${asset.toLowerCase()};context=${recipientAddress.toLowerCase()}/`;
    const timedecayFilterAlgorithm = (algorithm === 'links') ? 'filter_timedecay/' : '';
    const whitelistFilterAlgorithm = whitelist ? `filter_whitelist;whitelist=${whitelist.toLowerCase()}/` : '';
    const groupFilterAlgorithm = 'filter_group;sum_keys=score;sum_keys=total/';
    let links: IRemoteLink[] = [];
    try {
      // tslint:disable-next-line max-line-length
      const { items = [] } = await fetch(`${rankingApiUrl}${timedecayFilterAlgorithm}${whitelistFilterAlgorithm}${groupFilterAlgorithm}`)
        .then(throwErrorOnNotOkResponse)
        .then<{ items: IRemoteLink[] }>((res) => res.json());
      links = items;
    } catch (e) {
      console.info('Something went wrong 😞');
    }
    const duration = (new Date()).getTime() - start.getTime();
    setTimeout(() => {
      this.setState({
        fetched: true,
        links: calculateProbabilities(links),
      });
    }, 2 * this.lastFetchTime - duration);
    setTimeout(this._fetchLinks, timeslot - 2 * duration);
    this.lastFetchTime = duration;
  }

  _onLink = (currentLink: ILink) => {
    this.setState({ currentLink });
  }
}
