import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import qs from 'qs';
import Web3 from 'web3';
import { History, Location } from 'history';

import core from '@userfeeds/core/src';
import web3, { getInfura } from '@linkexchange/utils/web3';
import CopyFromMM from '@linkexchange/copy-from-mm';
import wait from '@linkexchange/utils/wait';
import Link from '@linkexchange/components/src/Link';
import Icon from '@linkexchange/components/src/Icon';
import Paper from '@linkexchange/components/src/Paper';
import Loader from '@linkexchange/components/src/Loader';
import { IRemoteLink } from '@linkexchange/types/link';
import Pill from '@linkexchange/components/src/Pill';
import updateQueryParam, { IUpdateQueryParamProp } from '@linkexchange/components/src/containers/updateQueryParam';

import { Field, Title, Description, RadioGroup } from '@linkexchange/components/src/Form/Field';
import { Input as fieldInput } from '@linkexchange/components/src/Form/field.scss';
import Input from '@linkexchange/components/src/Form/Input';
import Asset, { WIDGET_NETWORKS } from '@linkexchange/components/src/Form/Asset';

import LinksList from './components/LinksList';

import * as style from './whitelist.scss';

export type TWhitelistableClickableLink = IRemoteLink & {
  whitelisted: boolean;
};

interface IState {
  links: TWhitelistableClickableLink[];
  fetching: boolean;
  apiUrl: string;
  recipientAddress: string;
  recipientAddressFromParams: boolean;
  whitelist: string;
  whitelistFromParams: boolean;
  asset: {
    token: string;
    network: string;
  };
  assetFromParams: boolean;
  algorithm: string;
}

type TProps = IUpdateQueryParamProp & {
  history: History;
  location: Location;
};

class Whitelist extends Component<TProps, IState> {
  web3: Web3;
  fetchInterval: number | null = null;

  constructor(props: TProps) {
    super(props);

    const params = qs.parse(props.location.search.replace('?', ''));
    const paramsAsset = params.asset;
    let asset;
    if (paramsAsset && typeof paramsAsset === 'string') {
      const [network, token = ''] = paramsAsset.split(':');
      asset = { network, token };
    } else {
      asset = {
        token: WIDGET_NETWORKS[0].tokens[0].value,
        network: WIDGET_NETWORKS[0].value,
      };
    }

    this.web3 = getInfura(asset.network);

    this.state = {
      links: [],
      fetching: false,
      apiUrl: params.apiUrl || 'https://api.userfeeds.io',
      asset,
      recipientAddress: params.recipientAddress || '',
      algorithm: params.algorithm || 'links',
      whitelist: params.whitelist || '',
      recipientAddressFromParams: !!params.recipientAddress,
      whitelistFromParams: !!params.whitelist,
      assetFromParams: !!params.asset,
    };
  }

  componentWillMount() {
    if (this.state.recipientAddressFromParams) {
      this._fetchLinksAndShowLoader();
    }
  }

  render() {
    const { asset } = this.state;
    return (
      <div className={style.self}>
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
                append={(className) => (
                  <CopyFromMM onClick={this._setAddressFromMM('recipientAddress')} className={className} />
                )}
              />
            </Field>
            <Field>
              <Title>Whitelist Address</Title>
              <Input
                type="text"
                value={this.state.whitelist}
                onChange={this._onChange('whitelist')}
                append={(className) => (
                  <CopyFromMM onClick={this._setAddressFromMM('whitelist')} className={className} />
                )}
              />
            </Field>
            <Field>
              <Title>Choose token</Title>
              <div className={fieldInput}>
                <Asset asset={this.state.asset} onChange={this._onAssetChange} />
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
                <h3 style={{ margin: '20px 0 0', fontWeight: 'normal' }}>There are no links matching this data</h3>
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
                <h3 style={{ margin: '20px 0 0', fontWeight: 'normal' }}>There are no links matching this data</h3>
              </div>
            )}
          </div>
        </Paper>
      </div>
    );
  }

  _linksWaitingForApproval = () => this.state.links.filter((link) => !link.whitelisted);
  _linksApproved = () => this.state.links.filter((link) => link.whitelisted);

  _setAddressFromMM = (key) => async () => {
    const [account = ''] = await web3.eth.getAccounts();

    this.setState({ [key]: account });
    this.props.updateQueryParam(key, account);
    this._fetchLinksAndShowLoader();
  };

  _onChange = (key) => (e) => {
    const { value } = e.target;
    this.setState({ [key]: value }, () => {
      this._debouncedFetchLinks();
    });
    this.props.updateQueryParam(key, value);
  };

  _onAssetChange = (value) => {
    this.web3 = getInfura(value.network);
    this.setState({ asset: value }, () => {
      this._fetchLinksAndShowLoader();
    });
    this.props.updateQueryParam('asset', `${value.network}:${value.token}`);
  };

  _fetchLinks = async () => {
    if (this.fetchInterval !== null) {
      window.clearInterval(this.fetchInterval);
    }

    try {
      const [allLinks, whitelistedLinks] = await Promise.all([this._fetchAllLinks(), this._fetchWhitelistedLinks()]);

      const links = allLinks.items.map((link) => {
        const whitelisted = !!whitelistedLinks.items.find((a) => link.id === a.id);
        const parsedLink = {
          ...link,
          id: link.id,
          whitelisted,
          title: link.title,
          summary: link.summary,
          target: link.target,
          total: link.total,
        };
        return parsedLink;
      });
      this.setState({ links });
    } catch (_) {
      // ToDo Show error toast?
    }

    this.fetchInterval = window.setInterval(this._fetchLinks, 2000);
  };

  _fetchLinksAndShowLoader = async () => {
    this.setState({ fetching: true, links: [] });

    const startTime = Date.now();
    this._fetchLinks();

    const totalTime = Date.now() - startTime;
    if (totalTime < 1000) {
      await wait(1000 - totalTime);
    }

    this.setState({ fetching: false });
  };

  _fetchLinksImpl = async (whitelistFilterAlgorithm: string) => {
    const { apiUrl, recipientAddress, algorithm, asset } = this.state;
    const assetString = asset.token ? `${asset.network}:${asset.token.toLowerCase()}` : asset.network;
    const context = recipientAddress.toLowerCase();
    const rankingApiUrl = `${apiUrl}/ranking/${algorithm};asset=${assetString};context=${context}/`;
    const timedecayFilterAlgorithm = algorithm === 'links' ? 'filter_timedecay/' : '';
    const groupFilterAlgorithm = 'filter_group;sum_keys=score;sum_keys=total/';
    return fetch(`${rankingApiUrl}${timedecayFilterAlgorithm}${whitelistFilterAlgorithm}${groupFilterAlgorithm}`).then<{
      items: IRemoteLink[];
    }>((res) => res.json());
  };

  _fetchAllLinks = async () => {
    const whitelistFilterAlgorithm = '';
    return this._fetchLinksImpl(whitelistFilterAlgorithm);
  };

  _fetchWhitelistedLinks = async () => {
    const { whitelist } = this.state;
    const whitelistFilterAlgorithm = whitelist ? `filter_whitelist;whitelist=${whitelist.toLowerCase()}/` : '';
    return this._fetchLinksImpl(whitelistFilterAlgorithm);
  };

  _debouncedFetchLinks = debounce(this._fetchLinksAndShowLoader, 500);
}

export default updateQueryParam(Whitelist);
