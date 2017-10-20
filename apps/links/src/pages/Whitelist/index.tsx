import React, { Component } from 'react';
import debounce from 'lodash.debounce';

import core from '@userfeeds/core/src';
import web3 from '@userfeeds/utils/src/web3';
import Link from '@userfeeds/apps-components/src/Link';
import Icon from '@userfeeds/apps-components/src/Icon';
import Paper from '@userfeeds/apps-components/src/Paper';
import Loader from '@userfeeds/apps-components/src/Loader';
import { IRemoteLink } from '@userfeeds/types/link';
import Pill from '@userfeeds/apps-components/src/Pill';
import Intercom from '@userfeeds/apps-components/src/Intercom';

import { Field, Title, Description, RadioGroup } from '@userfeeds/apps-components/src/Form/Field';
import { input as fieldInput } from '@userfeeds/apps-components/src/Form/field.scss';
import Input from '@userfeeds/apps-components/src/Form/Input';
import Asset, { WIDGET_NETWORKS } from '@userfeeds/apps-components/src/Form/Asset';
import LinksList from './components/LinksList';

import * as style from './whitelist.scss';

export type TWhitelistableClickableLink = IRemoteLink & {
  whitelisted: boolean;
  onClick(): void;
};

interface IState {
  links: TWhitelistableClickableLink[];
  fetching: boolean;
  apiUrl: string;
  recipientAddress: string;
  recipientAddressFromParams: boolean;
  whitelistId: string;
  whitelistIdFromParams: boolean;
  asset: {
    token: string;
    network: string;
  };
  assetFromParams: boolean;
  algorithm: string;
  decimals?: string;
}

interface IProps {
  location: any;
}

export default class Whitelist extends Component<IProps, IState> {
  constructor(props) {
    super(props);

    const params = new URLSearchParams(props.location.search);
    const paramsAsset = params.get('asset');
    let asset;
    if (paramsAsset) {
      asset = {
        network: paramsAsset.split(':')[0],
        token: paramsAsset.split(':')[1],
      };
    } else {
      asset = {
        token: WIDGET_NETWORKS[0].tokens[0].value,
        network: WIDGET_NETWORKS[0].value,
      };
    }
    this.state = {
      links: [],
      fetching: false,
      apiUrl: params.get('apiUrl') || 'https://api-dev.userfeeds.io',
      asset,
      recipientAddress: params.get('recipientAddress') || '',
      algorithm: params.get('algorithm') || 'links',
      whitelistId: params.get('whitelist') || '',
      recipientAddressFromParams: params.has('recipientAddress'),
      whitelistIdFromParams: params.has('whitelist'),
      assetFromParams: params.has('asset'),
      decimals: params.get('tokenDetails[decimals]') || undefined,
    };
  }

  componentWillMount() {
    if (this.state.recipientAddressFromParams) {
      this._fetchLinks();
    }
  }

  render() {
    return (
      <div className={style.self}>
        <Intercom settings={{ app_id: 'xdam3he4' }} />
        <Paper className={style.container}>
          <div className={style.head}>
            <h2 className={style.header}>Input the data for your whitelist</h2>
          </div>
          <div className={style.body} style={{ padding: '20px' }}>
            <Field>
              <Title>Recipient Address</Title>
              <Input
                type="text"
                value={this.state.recipientAddress}
                onChange={this._onChange('recipientAddress')}
              />
            </Field>
            <Field>
              <Title>Whitelist Address</Title>
              <Input
                type="text"
                value={this.state.whitelistId}
                onChange={this._onChange('whitelistId')}
              />
            </Field>
            <Field>
              <Title>Choose token</Title>
              <div className={fieldInput}>
                <Asset asset={this.state.asset} onChange={this._onOldChange('asset')} />
              </div>
            </Field>
          </div>
        </Paper>
        <Paper className={style.container}>
          <div className={style.head}>
            <h2 className={style.header}>
              Waiting for approval
              {this._linksWaitingForApproval().length > 0 && (
                <Pill className={style.counter}>{this._linksWaitingForApproval().length}</Pill>
              )}
            </h2>
          </div>
          <div className={style.body}>
            {this.state.fetching ? (
              <Loader
                containerStyle={{
                  margin: '20px auto',
                }}
              />
            ) : this._linksWaitingForApproval().length > 0 ? (
              <LinksList links={this._linksWaitingForApproval()} />
            ) : (
              <div style={{ textAlign: 'center', color: '#1b2437', padding: '20px' }}>
                <Icon name="link-broken" style={{ fontSize: '50px', opacity: 0.5 }} />
                <h3 style={{ margin: '20px 0 0', fontWeight: 'normal' }}>
                  There are no links matching this data
                </h3>
              </div>
            )}
          </div>
        </Paper>
        <Paper className={style.container}>
          <div className={style.head}>
            <h2 className={style.header}>
              Approved
              {this._linksApproved().length > 0 && (
                <Pill className={style.counter}>{this._linksApproved().length}</Pill>
              )}
            </h2>
          </div>
          <div className={style.body}>
            {this.state.fetching ? (
              <Loader
                containerStyle={{
                  margin: '20px auto',
                }}
              />
            ) : this._linksApproved().length > 0 ? (
              <LinksList links={this._linksApproved()} />
            ) : (
              <div style={{ textAlign: 'center', color: '#1b2437', padding: '20px' }}>
                <Icon name="link-broken" style={{ fontSize: '50px', opacity: 0.5 }} />
                <h3 style={{ margin: '20px 0 0', fontWeight: 'normal' }}>
                  There are no links matching this data
                </h3>
              </div>
            )}
          </div>
        </Paper>
      </div>
    );
  }

  _linksWaitingForApproval = () => this.state.links.filter((link) => !link.whitelisted);
  _linksApproved = () => this.state.links.filter((link) => link.whitelisted);

  _onChange = (key) => (e) => {
    this.setState({ [key]: e.target.value }, () => {
      this._debouncedFetchLinks();
    });
  }

  _onOldChange = (key) => (value) => {
    this.setState({ [key]: value }, () => {
      this._fetchLinks();
    });
  }

  _fetchLinks = async () => {
    this.setState({ fetching: true, links: [] });
    try {
      const [allLinks, whitelistedLinks] = await Promise.all([
        this._fetchAllLinks(),
        this._fetchWhitelistedLinks(),
      ]);

      const links = allLinks.items.map((link) => {
        const whitelisted = !!whitelistedLinks.items.find((a) => link.id === a.id);
        const parsedLink = {
          ...link,
          id: link.id,
          whitelisted,
          title: link.title,
          summary: link.summary,
          target: link.target,
          total: this._totalSpentFromTokensWei(link.total, this.state.decimals),
          onClick: () => this._onLinkClick(link),
        };
        return parsedLink;
      });
      this.setState({ links, fetching: false });
    } catch (_) {
      this.setState({ fetching: false });
    }
  }

  _fetchAllLinks = async () => {
    const { apiUrl, recipientAddress, algorithm, asset } = this.state;
    const assetString = asset.token
      ? `${asset.network}:${asset.token.toLowerCase()}`
      : asset.network;

    return fetch(
      `${apiUrl}/ranking/${assetString}:${recipientAddress.toLowerCase()}/${algorithm}/`,
    ).then<{ items: IRemoteLink[] }>((res) => res.json());
  }

  _fetchWhitelistedLinks = async () => {
    const { apiUrl, recipientAddress, algorithm, whitelistId, asset } = this.state;
    const assetString = asset.token
      ? `${asset.network}:${asset.token.toLowerCase()}`
      : asset.network;
    const whitelistParam = whitelistId ? `?whitelist=${whitelistId.toLowerCase()}` : '';

    return fetch(
      `${apiUrl}/ranking/${assetString}:${recipientAddress.toLowerCase()}/${algorithm}/${whitelistParam}`,
    ).then<{ items: IRemoteLink[] }>((res) => res.json());
  }

  _totalSpentFromTokensWei = (tokenWei: number, decimals: string = '18') => {
    return web3
      .toBigNumber(tokenWei)
      .shift(-web3.toBigNumber(decimals))
      .toString();
  }

  _debouncedFetchLinks = debounce(this._fetchLinks, 500);

  _onLinkClick = (link) => {
    const claim = {
      claim: { target: link.id },
    };

    core.ethereum.claims.sendClaimWithoutValueTransfer(web3, claim);
  }
}
