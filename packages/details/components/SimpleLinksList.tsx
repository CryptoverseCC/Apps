import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import web3 from '@linkexchange/utils/web3';
import { fromWeiToString } from '@linkexchange/utils/balance';
import { ILink, IRemoteLink } from '@linkexchange/types/link';

import Link from '@linkexchange/components/src/Link';
import TextWithLabel from '@linkexchange/components/src/TextWithLabel';
import { TokenDetailsProviderWithInfura } from '@linkexchange/token-details-provider';

import * as style from './simpleLinksList.scss';

interface ISimpleLinksListProps {
  asset: string;
  links: ILink[] | IRemoteLink[];
}

interface ISimpleLinksListState {
  maxRows: number;
}

export default class SimpleLinksList extends Component<ISimpleLinksListProps, ISimpleLinksListState> {
  // ToDo make it better
  columns = [
    {
      name: <FormattedMessage id="list.header.no" defaultMessage="NO" />,
      prop: (_, index) => index + 1,
    },
    {
      name: <FormattedMessage id="list.header.probability" defaultMessage="Probability" />,
      prop: (link: ILink) => (typeof link.probability === 'number' ? `${link.probability}%` : '-'),
    },
    {
      name: <FormattedMessage id="list.header.bids" defaultMessage="Bids" />,
      prop: (link: ILink) => link.group_count,
    },
    {
      name: <FormattedMessage id="list.header.score" defaultMessage="Current score" />,
      prop: (link: ILink) => (
        <TokenDetailsProviderWithInfura
          asset={this.props.asset}
          render={({ decimals }) => fromWeiToString(link.score, decimals)}
        />
      ),
    },
  ];

  state = {
    maxRows: 5,
  };

  render() {
    const { links } = this.props;
    const { maxRows } = this.state;

    return (
      <div className={style.self}>
        {links.slice(0, maxRows).map(this._renderRow)}
        {this._renderLoadMore()}
      </div>
    );
  }

  _renderRow = (link: ILink, index: number) => {
    return (
      <div className={style.linkRow}>
        <Link link={link} />
        <div className={style.linkProperties}>
          {this.columns.map(({ name, prop }) => <TextWithLabel label={name} text={prop(link, index)} />)}
        </div>
        <hr />
      </div>
    );
  };

  _renderLoadMore = () => {
    if (this.state.maxRows < this.props.links.length) {
      return (
        <div className={style.loadMore} onClick={this._onLoadMore}>
          <span>Load More</span>
        </div>
      );
    }

    return null;
  };

  _onLoadMore = () => {
    this.setState({ maxRows: this.state.maxRows * 2 });
  };
}
