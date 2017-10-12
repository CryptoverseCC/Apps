import React, { Component } from 'react';

import Input from '@userfeeds/apps-components/src/Input';
import Dropdown from '@userfeeds/apps-components/src/Dropdown';
import Wrapper from './Wrapper';

export const ETH = 'eth';
export const CUSTOM_TOKEN = 'custom';
const OTHER_ERC20_TOKEN = { value: CUSTOM_TOKEN, label: 'Other ERC20 Token' };

export const WIDGET_NETWORKS = [
  {
    value: 'ethereum',
    label: 'Mainnet',
    tokens: [
      { value: ETH, label: 'ETH' },
      { value: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07', label: 'OmiseGO (OMG)' },
      { value: '0x9a642d6b3368ddc662CA244bAdf32cDA716005BC', label: 'Qtum' },
      { value: '0xc66ea802717bfb9833400264dd12c2bceaa34a6d', label: 'Maker (MKR)' },
      { value: '0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0', label: 'EOS' },
      { value: '0xB97048628DB6B661D4C2aA833e95Dbe1A905B280', label: 'TenXPay (PAY)' },
      { value: '0xe94327d07fc17907b4db788e5adf2ed424addff6', label: 'Augur (REP)' },
      { value: '0x0d8775f648430679a709e98d2b0cb6250d2887ef', label: 'Basic Attention Token (BAT)' },
      { value: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200', label: 'Kyber Network Crystal (KNC)' },
      { value: '0x888666CA69E0f178DED6D75b5726Cee99A87D698', label: 'ICONOMI (ICN)' },
      { value: '0xF433089366899D83a9f26A773D59ec7eCF30355e', label: 'Metal (MTL)' },
      { value: '0x6810e776880c02933d47db1b9fc05908e5386b96', label: 'Gnosis Token (GNO)' },
      { value: '0x41e5560054824ea6b0732e656e3ad64e20e94e45', label: 'Civic (CVC)' },
      { value: '0x419d0d8bdd9af5e606ae2232ed285aff190e711b', label: 'FunFair (FUN)' },
      { value: '0xe41d2489571d322189246dafa5ebde1f4699f498', label: '0x Protocol Token (ZRX)' },
      { value: '0x744d70fdbe2ba4cf95131626614a1763df805b9e', label: 'Status Network Token (SNT)' },
      { value: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c', label: 'Bancor Network Token (BNT)' },
      { value: '0xaec2e87e0a235266d9c5adc9deb4b2e29b54d009', label: 'SingularDTV (SNGLS)' },
      { value: '0xb63b606ac810a52cca15e44bb630fd42d8d1d83d', label: 'Monaco (MCO)' },
      { value: '0x960b236A07cf122663c4303350609A66A7B288C0', label: 'Aragon Network Token (ANT)' },
      { value: '0x108c05cac356d93b351375434101cfd3e14f7e44', label: 'Token of Szczepan Bentyn (BEN)' },
      OTHER_ERC20_TOKEN,
    ],
  },
  {
    value: 'rinkeby',
    label: 'Rinkeby',
    tokens: [
      { value: ETH, label: 'ETH (rinkeby)' },
      { value: '0x5301f5b1af6f00a61e3a78a9609d1d143b22bb8d', label: 'MG6T' },
      { value: '0x52e89f277d1624db80d8c56dd7780e99fa4d5ef6', label: 'WLS' },
      OTHER_ERC20_TOKEN,
    ],
  },
  {
    value: 'ropsten',
    label: 'Ropsten',
    tokens: [
      { value: ETH, label: 'ETH (ropsten)' },
      { value: '0x31d46d605703f66bd3ea95f699ddec9114fe9b89', label: 'JST' },
      { value: '0x95642c3bcabfbd1cefd7d9f6dff4e9a96197e26c', label: 'MG6T' },
      OTHER_ERC20_TOKEN,
    ],
  },
];

interface IAsset {
  token: string;
  network: string;
}

interface IAssetProps {
  asset: IAsset;
  onChange(asset: IAsset);
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
      WIDGET_NETWORKS[WIDGET_NETWORKS.findIndex((e) => e.value === asset.network)].tokens;

    const ContractAddress =
      token === CUSTOM_TOKEN ? (
        <Input
          placeholder="Contract address"
          value={tokenAddress}
          onInput={this._onAddressChange}
        />
      ) : null;
    return (
      <Wrapper>
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
        </div>
        {ContractAddress}
      </Wrapper>
    );
  }

  _onNetworkChange = ({ value }) => {
    const token =
      WIDGET_NETWORKS[WIDGET_NETWORKS.findIndex((e) => e.value === value)].tokens[0].value;
    this.setState({ token, tokenAddress: token }, () => {
      this.props.onChange({ network: value, token: this.state.tokenAddress });
    });
  }

  _onTokenChange = ({ value }) => {
    this.setState({ token: value, tokenAddress: '' });
    const token = value === CUSTOM_TOKEN ? '' : value;
    this.props.onChange({ token, network: this.props.asset.network });
  }

  _onAddressChange = (e: Event) => {
    const value = e.target.value;
    this.setState({ tokenAddress: value });
    this.props.onChange({ token: value, network: this.props.asset.network });
  }

  _isCustomToken = (network, token) => {
    const tokensOptions =
      WIDGET_NETWORKS[WIDGET_NETWORKS.findIndex((e) => e.value === network)].tokens;
    return tokensOptions.findIndex(({ value }) => value === token) === -1;
  }
}
