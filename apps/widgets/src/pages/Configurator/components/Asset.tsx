import React, { Component } from 'react';

import Input from '@userfeeds/apps-components/src/Input';
import Dropdown from '@userfeeds/apps-components/src/Dropdown';

export const ETH = 'eth';
export const CUSTOM_TOKEN = 'custom';
const OTHER_ERC20_TOKEN = { value: CUSTOM_TOKEN, label: 'Other ERC20 Token' };

export const WIDGET_NETWORKS = [
  {
    value: 'ethereum',
    label: 'Mainnet',
    tokens: [
      { value: ETH, label: 'ETH' },
      { value: '0xE41d2489571d322189246DaFA5ebDe1F4699F498', label: 'ZRX' },
      OTHER_ERC20_TOKEN,
    ],
  },
  {
    value: 'rinkeby',
    label: 'Rinkeby',
    tokens: [
      { value: ETH, label: 'ETH (rinkeby)' },
      { value: '0xE41d2489571d322189246DaFA5ebDe1F4699F499', label: 'STH' },
      OTHER_ERC20_TOKEN,
    ],
  },
  {
    value: 'kovan',
    label: 'Kovan',
    tokens: [
      { value: ETH, label: 'ETH (kovan)' },
      { value: '0xE41d2489571d322189246DaFA5ebDe1F4699F500', label: 'XXX Coin' },
      { value: '0xE41d2489571d322189246DaFA5ebDe1F4699F501', label: 'YYY Token' },
      { value: '0xE41d2489571d322189246DaFA5ebDe1F4699F502', label: 'ZZZ Coin' },
      OTHER_ERC20_TOKEN,
    ],
  },
];

type asset = { token: string; network: string };

interface IAssetProps {
  asset: asset;
  onChange(asset: asset);
}

interface IAssetState {
  token: string;
  tokenAddress?: string;
}

export default class Asset extends Component<IAssetProps, IAssetState> {
  constructor(props) {
    super(props);

    const token = this._isCustomToken(props.asset.network, props.asset.token)
      ? CUSTOM_TOKEN
      : props.asset.token;
    this.state = { token, tokenAddress: props.asset.token };
  }

  render() {
    const { asset, onChange } = this.props;
    const { token, tokenAddress } = this.state;
    const tokensOptions =
      WIDGET_NETWORKS[WIDGET_NETWORKS.findIndex(e => e.value === asset.network)].tokens;

    const ContractAddress =
      token === CUSTOM_TOKEN ? (
        <Input
          placeholder="Contract address"
          value={tokenAddress}
          onInput={this._onAddressChange}
        />
      ) : null;
    return [
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Dropdown
          style={{ minWidth: '200px' }}
          placeholder="Network"
          value={asset.network}
          onChange={this._onNetworkChange}
          options={WIDGET_NETWORKS}
        />
        <Dropdown
          style={{ minWidth: '200px' }}
          placeholder="ERC20 Token Address"
          value={token}
          onChange={this._onTokenChange}
          options={tokensOptions}
        />
      </div>,
      ContractAddress,
    ];
  }

  _onNetworkChange = ({ value }) => {
    const token =
      WIDGET_NETWORKS[WIDGET_NETWORKS.findIndex(e => e.value === value)].tokens[0].value;
    this.setState({ token: token, tokenAddress: token }, () => {
      this.props.onChange({ network: value, token: this.state.tokenAddress });
    });
  };

  _onTokenChange = ({ value }) => {
    this.setState({ token: value, tokenAddress: '' });
    const token = value === CUSTOM_TOKEN ? '' : value;
    this.props.onChange({ token, network: this.props.asset.network });
  };

  _onAddressChange = (e: Event) => {
    const value = e.target.value;
    this.setState({ tokenAddress: value });
    this.props.onChange({ token: value, network: this.props.asset.network });
  };

  _isCustomToken = (network, token) => {
    const tokensOptions =
      WIDGET_NETWORKS[WIDGET_NETWORKS.findIndex(e => e.value === network)].tokens;
    return tokensOptions.findIndex(({ value }) => value === token) === -1;
  };
}
