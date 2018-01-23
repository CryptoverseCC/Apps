import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import Link from '@linkexchange/components/src/Link';
import Paper from '@linkexchange/components/src/Paper';
import Button from '@linkexchange/components/src/Button';
import { ILink, IRemoteLink } from '@linkexchange/types/link';
import BoostLinkComponentComponent from '@linkexchange/boost-link';
import web3, { withInfura, withInjectedWeb3 } from '@linkexchange/utils/web3';
import { withTokenDetails, TokenDetailsProviderWithInfura } from '@linkexchange/token-details-provider';
import Web3StateProvider from '@linkexchange/web3-state-provider';
import { fromWeiToString } from '@linkexchange/utils/balance';

import * as style from './linksList.scss';

export interface IDefaultBoostLinkWrapperProps {
  asset: string;
  recipientAddress: string;
  link: ILink | IRemoteLink;
  linksInSlots: ILink[] | IRemoteLink[];
  onSuccess(transationId: string): void;
  onError(error: any): void;
}

const InjectedWeb3StateProvider = withInjectedWeb3(Web3StateProvider);
const BoostLinkComponent = withInjectedWeb3(withTokenDetails(BoostLinkComponentComponent));

const DefaultBoostLink = (props: IDefaultBoostLinkWrapperProps) => {
  return (
    <InjectedWeb3StateProvider
      asset={props.asset}
      render={({ enabled, reason }) => (
        <BoostLinkComponent loadBalance asset={props.asset} {...props} disabled={!enabled} disabledReason={reason} />
      )}
    />
  );
};

interface ILinksListProps {
  label: string | JSX.Element;
  links: ILink[] | IRemoteLink[];
  linksInSlots: ILink[];
  asset: string;
  boostLinkComponent?: React.ComponentType<IDefaultBoostLinkWrapperProps>;
  recipientAddress: string;
  onBoostSuccess: (transationId: string) => void;
  onBoostError: (error: any) => void;
  showProbability?: boolean;
}

interface ILinksListState {
  maxRows: number;
}

export default class LinksList extends Component<ILinksListProps, {}> {
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
      name: <FormattedMessage id="list.header.content" defaultMessage="Content" />,
      prop: (link: ILink) => <Link style={{ maxWidth: '200px' }} link={link} />,
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
    {
      name: <FormattedMessage id="list.header.bids" defaultMessage="Bids" />,
      prop: (link: ILink) => {
        const { boostLinkComponent: BoostLink = DefaultBoostLink } = this.props;

        return (
          <div className={style.boostCell}>
            {link.group_count || 0}
            <BoostLink
              asset={this.props.asset}
              recipientAddress={this.props.recipientAddress}
              onSuccess={this.props.onBoostSuccess}
              onError={this.props.onBoostError}
              link={link}
              linksInSlots={this.props.linksInSlots}
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
        <tr>{this.columns.map(({ name }, index) => <th key={index}>{name}</th>)}</tr>
      </thead>
    );
  };

  _renderRow = (link: ILink, index: number) => {
    return (
      <tr key={link.id}>
        {this.columns.map(({ prop }, columnIndex) => <td key={`${columnIndex}_${link.id}`}>{prop(link, index)}</td>)}
      </tr>
    );
  };

  _renderLoadMore = () => {
    if (this.state.maxRows < this.props.links.length) {
      return (
        <tr className={style.loadMore} onClick={this._onLoadMore}>
          <td colSpan={this.columns.length}>Load More</td>
        </tr>
      );
    }

    return null;
  };

  _onLoadMore = () => {
    this.setState({ maxRows: this.state.maxRows * 2 });
  };
}
