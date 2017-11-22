import React, { Component } from 'react';

import { IWidgetSettings } from '@linkexchange/types/widget';
import { IRemoteLink, ILink } from '@linkexchange/types/link';
import { throwErrorOnNotOkResponse } from '@linkexchange/utils/src/fetch';
import calculateProbabilities from '@linkexchange/utils/src/links';

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

export default class App extends Component<IAppProps, IAppState> {
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
          timeslot={20 * 1000}
        />
      </div>
    );
  }

  _fetchLinks = async () => {
    const {
      apiUrl = 'https://api.userfeeds.io',
      recipientAddress,
      asset,
      algorithm,
      whitelist,
    } = this.props.widgetSettings;
    const rankingApiUrl = `${apiUrl}/ranking/${asset}:${recipientAddress}/${algorithm}/`;
    const whitelistQueryParam = whitelist ? `?whitelist=${whitelist}` : '';
    try {
      const { items: links = [] } = await fetch(`${rankingApiUrl}${whitelistQueryParam}`)
        .then(throwErrorOnNotOkResponse)
        .then<{ items: IRemoteLink[] }>((res) => res.json());
      this.setState({
        fetched: true,
        links: calculateProbabilities(links),
      });
    } catch (e) {
      console.info('Something went wrong 😞');
    }
  }

  _onLink = (currentLink: ILink) => {
    this.setState({ currentLink });
  }
}
