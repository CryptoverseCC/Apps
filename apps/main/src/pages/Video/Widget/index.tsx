import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import qs from 'qs';
import Web3 from 'web3';

import Web3Store from '@linkexchange/web3-store';
import { WidgetSettings } from '@linkexchange/widget-settings';
import { IRemoteLink, ILink } from '@linkexchange/types/link';
import { throwErrorOnNotOkResponse } from '@linkexchange/utils/fetch';
import calculateProbabilities from '@linkexchange/utils/links';

import Link from './components/Link';
import LinkProvider from './containers/LinkProvider';

interface IProps {
  location: Location;
  web3Store: Web3Store;
  widgetSettingsStore: WidgetSettings;
}

interface IState {
  position?: 'bottom' | 'top';
  fetched: boolean;
  links: ILink[];
  linkDuration?: number;
  currentLink?: ILink;
}

class Widget extends Component<IProps, IState> {
  lastFetchTime: number = 0;
  infura: Web3;

  constructor(props: IProps) {
    super(props);
    const { position } = qs.parse(props.location.search.replace('?', ''));

    this.state = {
      position: position || 'bottom',
      fetched: false,
      links: [],
    };
  }

  componentDidMount() {
    this.fetchLinks();
  }

  timeslot = () => {
    const { timeslot = 20 } = this.props.widgetSettingsStore;
    return timeslot * 1000;
  };

  render() {
    const { web3Store } = this.props;
    const { currentLink, linkDuration, links, position, fetched } = this.state;

    if (!fetched) {
      return null;
    }

    return (
      <div>
        <Link link={currentLink} linkDuration={linkDuration!} tokenSymbol={web3Store.symbol} position={position} />
        <LinkProvider links={links} onLink={this.onLink} timeslot={this.timeslot()} />
      </div>
    );
  }

  private fetchLinks = async () => {
    const start = new Date();
    const {
      apiUrl = 'https://api.userfeeds.io',
      recipientAddress,
      asset,
      algorithm,
      whitelist,
    } = this.props.widgetSettingsStore;

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
      links = items.slice(0, this.props.widgetSettingsStore.slots);
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
    setTimeout(this.fetchLinks, this.timeslot() * 1000 - 2 * duration);
    this.lastFetchTime = duration;
  };

  private onLink = (currentLink: ILink, duration: number) => {
    this.setState({ currentLink, linkDuration: duration });
  };
}

export default inject('widgetSettingsStore', 'web3Store')(observer(Widget));
