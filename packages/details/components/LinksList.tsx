import React, { Component } from 'react';

import Link from '@linkexchange/components/src/Link';
import Paper from '@linkexchange/components/src/Paper';
import Button from '@linkexchange/components/src/Button';
import { ILink, IRemoteLink } from '@linkexchange/types/link';
import BoostLinkComponent from '@linkexchange/boost-link';
import web3 from '@linkexchange/utils/web3';
import Web3StateProvider from '@linkexchange/web3-state-provider';

import * as style from './linksList.scss';

export interface IDefaultBoostLinkWrapperProps {
  asset: string;
  recipientAddress: string;
  onSuccess(transationId: string): void;
  onError(error: any): void;
  link: ILink | IRemoteLink;
  links: ILink[] | IRemoteLink[];
}

const DefaultBoostLink = (props: IDefaultBoostLinkWrapperProps) => {
  const [desiredNetwork] = props.asset.split(':');

  return (
    <Web3StateProvider
      desiredNetwork={desiredNetwork}
      render={({ enabled, reason }) => (
        <BoostLinkComponent
          {...props}
          disabled={!enabled}
          disabledReason={reason}
        />
      )}
    />
  );
};

interface ILinksListProps {
  label: string;
  links: ILink[] | IRemoteLink[];
  asset: string;
  boostLinkComponent?: React.ComponentType<IDefaultBoostLinkWrapperProps>;
  recipientAddress: string;
  onBoostSuccess?: (transationId: string) => void;
  onBoostError?: (error: any) => void;
  showProbability?: boolean;
}

interface ILinksListState {
  maxRows: number;
}

export default class LinksList extends Component<ILinksListProps, {}> {
  // ToDo make it better
  columns = [
    {
      name: 'NO',
      prop: (_, index) => index + 1,
    },
    {
      name: 'Probability',
      prop: (link: ILink) => (typeof link.probability === 'number' ? `${link.probability}%` : '-'),
    },
    {
      name: 'Content',
      prop: (link: ILink) => <Link style={{ maxWidth: '200px' }} link={link} />,
    },
    {
      name: 'Current Score',
      prop: (link: ILink) => web3.fromWei(link.score, 'ether').substr(0, 5),
    },
    {
      name: 'Bids',
      prop: (link: ILink) => {
        const { boostLinkComponent: BoostLink = DefaultBoostLink} = this.props;

        return (
          <div className={style.boostCell}>
            {link.group_count || 0}
            <BoostLink
              asset={this.props.asset}
              recipientAddress={this.props.recipientAddress}
              onSuccess={this.props.onBoostSuccess}
              onError={this.props.onBoostError}
              link={link}
              links={this.props.links}
            />
          </div>
        );
      },
    },
  ];

  state = {
    maxRows: 5,
  };

  constructor(props: ILinksListProps) {
    super(props);
    const { showProbability = true } = props;

    if (!showProbability) {
      this.columns.splice(1, 1);
    }
  }

  render() {
    const { label, links } = this.props;
    const { maxRows } = this.state;
    return (
      <div className={style.self}>
        <h2 className={style.label}>{label}</h2>
        <Paper>
          <table className={style.table}>
            {this._renderHeader()}
            <tbody>
              {links.slice(0, maxRows).map(this._renderRow)}
              {this._renderLoadMore()}
            </tbody>
          </table>
        </Paper>
      </div>
    );
  }

  _renderHeader = () => {
    return (
      <thead className={style.tableHeader}>
        <tr>{this.columns.map(({ name }) => <th key={name}>{name}</th>)}</tr>
      </thead>
    );
  }

  _renderRow = (link: ILink, index: number) => {
    return (
      <tr key={link.id}>
        {this.columns.map(({ prop, name }) => (
          <td key={`${name}_${link.id}`}>{prop(link, index)}</td>
        ))}
      </tr>
    );
  }

  _renderLoadMore = () => {
    if (this.state.maxRows < this.props.links.length) {
      return (
        <tr className={style.loadMore} onClick={this._onLoadMore}>
          <td colSpan={this.columns.length}>Load More</td>
        </tr>
      );
    }

    return null;
  }

  _onLoadMore = () => {
    this.setState({ maxRows: this.state.maxRows * 2 });
  }
}
