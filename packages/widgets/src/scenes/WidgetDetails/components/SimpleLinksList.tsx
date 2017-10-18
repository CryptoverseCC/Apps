import React, { Component } from 'react';

import Link from '@userfeeds/apps-components/src/Link';
import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';
import { ILink, IRemoteLink } from '@userfeeds/types/link';
import web3 from '@userfeeds/utils/src/web3';

import * as style from './simpleLinksList.scss';

interface ISimpleLinksListProps {
  links: ILink[] | IRemoteLink[];
}

interface ISimpleLinksListState {
  maxRows: number;
}

export default class SimpleLinksList extends Component<ISimpleLinksListProps, ISimpleLinksListState> {

    // ToDo make it better
    columns = [{
      name: 'NO',
      prop: (_, index) => index + 1,
    }, {
      name: 'Probability',
      prop: (link: ILink) => typeof link.probability === 'number' ? `${link.probability}%` : '-',
    }, {
      name: 'Bids',
      prop: (link: ILink) => link.group_count,
    }, {
      name: 'Current Score',
      prop: (link: ILink) => web3.fromWei(link.score, 'ether').substr(0, 5),
    }];

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
          {this.columns.map(({ name, prop }) => (<TextWithLabel label={name} text={prop(link, index)} />))}
        </div>
        <hr />
      </div>
    );
  }

  _renderLoadMore = () => {
    if (this.state.maxRows < this.props.links.length) {
      return (
        <div className={style.loadMore} onClick={this._onLoadMore}>
          <span>Load More</span>
        </div>
      );
    }

    return null;
  }

  _onLoadMore = () => {
    this.setState({ maxRows: this.state.maxRows * 2 });
  }
}
