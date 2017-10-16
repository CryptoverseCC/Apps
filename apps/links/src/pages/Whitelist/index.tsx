import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import core from '@userfeeds/core/src';
import web3 from '@userfeeds/utils/src/web3';
import * as style from './whitelist.scss';
import Paper from '@userfeeds/apps-components/src/Paper';
import Link from '@userfeeds/apps-components/src/Link';
import Pill from '../../../../widgets/src/pages/Configurator/components/Pill';
import {
  Field,
  Title,
  Description,
  RadioGroup,
} from '../../../../widgets/src/pages/Configurator/components/Field';
import { input as fieldInput } from '../../../../widgets/src/pages/Configurator/components/field.scss';
import Input from '../../../../widgets/src/pages/Configurator/components/Input';
import Asset, {
  WIDGET_NETWORKS,
} from '../../../../widgets/src/pages/Configurator/components/Asset';
import LinksList from './components/LinksList';

interface IState {
  links: any[];
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
}

interface IProps {
  location: any;
}

export default class Whitelist extends Component<IProps, IState> {
  constructor(props) {
    super(props);

    const params = new URLSearchParams(props.location.search);
    const asset = params.get('asset')
      ? {
          network: params.get('asset').split(':')[0],
          token: params.get('asset').split(':')[1],
        }
      : {
          token: WIDGET_NETWORKS[0].tokens[0].value,
          network: WIDGET_NETWORKS[0].value,
        };

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
              <Pill className={style.counter}>{this.state.links.length}</Pill>
            </h2>
          </div>
          <div className={style.body}>
            <LinksList links={this.state.links} />
          </div>
        </Paper>
      </div>
    );
  }

  _onChange = (key) => (e) => {
    this.setState({ [key]: e.target.value }, () => {
      this._debouncedFetchLinks();
    });
  }

  _onOldChange = (key) => (value) => {
    this.setState({ [key]: value }, () => {
      this._debouncedFetchLinks();
    });
  }

  _fetchLinks = async () => {
    this.setState({ fetching: true });
    try {
      const [allLinks, whitelistedLinks] = await Promise.all([
        this._fetchAllLinks(),
        this._fetchWhitelistedLinks(),
      ]);

      const links = allLinks.items.map((link) => {
        const whitelisted = !!whitelistedLinks.items.find((a) => link.id === a.id);
        const sentBy = link.id.split(':')[1];
        const parsedLink = {
          id: link.id,
          whitelisted,
          sentBy,
          title: link.title,
          description: link.summary,
          link: link.target,
          totalSpent: link.total,
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
    const { apiUrl, recipientAddress, algorithm, whitelist, asset } = this.state;
    const assetString = asset.token ? `${asset.network}:${asset.token}` : asset.network;

    return fetch(`${apiUrl}/ranking/${assetString}:${recipientAddress}/${algorithm}/`).then((res) =>
      res.json(),
    );
  }

  _fetchWhitelistedLinks = async () => {
    const { apiUrl, recipientAddress, algorithm, whitelist, asset } = this.state;
    const assetString = asset.token ? `${asset.network}:${asset.token}` : asset.network;
    const whitelistParam = whitelist ? `?whitelist=${whitelist}` : '';

    return fetch(
      `${apiUrl}/ranking/${assetString}:${recipientAddress}/${algorithm}/${whitelistParam}`,
    ).then((res) => res.json());
  }

  _debouncedFetchLinks = debounce(this._fetchLinks, 500);

  _onLinkClick = (link) => {
    const claim = {
      claim: { target: link.id },
    };

    core.ethereum.claims.sendClaimWithoutValueTransfer(web3, claim);
  }
}
