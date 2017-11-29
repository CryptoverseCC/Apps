import React, { Component } from 'react';

import Input from '../Input';
import Dropdown from '../Dropdown';

export const ETHER = '';
export const CUSTOM_TOKEN = 'custom';
const OTHER_ERC20_TOKEN = { value: CUSTOM_TOKEN, label: 'Other ERC20 Token' };

export const WIDGET_NETWORKS = [
  {
    value: 'ethereum',
    label: 'Mainnet',
    tokens: [
      { value: ETHER, label: 'ETH' },
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
      {
        value: '0x108c05cac356d93b351375434101cfd3e14f7e44',
        label: 'Token of Szczepan Bentyn (BEN)',
      },
      OTHER_ERC20_TOKEN,
    ],
  },
  {
    value: 'rinkeby',
    label: 'Rinkeby',
    tokens: [
      { value: ETHER, label: 'ETH (rinkeby)' },
      { value: '0x5301f5b1af6f00a61e3a78a9609d1d143b22bb8d', label: 'MG6T' },
      { value: '0x52e89f277d1624db80d8c56dd7780e99fa4d5ef6', label: 'WLS' },
      OTHER_ERC20_TOKEN,
    ],
  },
  {
    value: 'ropsten',
    label: 'Ropsten',
    tokens: [
      { value: ETHER, label: 'ETH (ropsten)' },
      { value: '0x31d46d605703f66bd3ea95f699ddec9114fe9b89', label: 'JST' },
      { value: '0x95642c3bcabfbd1cefd7d9f6dff4e9a96197e26c', label: 'MG6T' },
      { value: '0x53Fb38a8EC4eCF22948E5970F93D7E2338A47114', label: 'MG6T2' },
      { value: '0x9E5063133518DeDC881150baf2481DAf3FfeE324', label: 'MG6T2.5' },
      { value: '0x6BDB3998972AD6F7a740523CCD3DE7b0B8a4a6C5', label: 'OMG (test)' },
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
  onChange(asset: IAsset & { isCustom?: boolean; });
}

interface IAssetState {
  dropdownTokenSelection: string;
}

export default class Asset extends Component<IAssetProps, IAssetState> {

  input: Input;

  constructor(props) {
    super(props);

    const dropdownTokenSelection = this._isCustomToken(props.asset.network, props.asset.token)
      ? CUSTOM_TOKEN
      : props.asset.token;
    this.state = { dropdownTokenSelection };
  }

  render() {
    const { asset } = this.props;
    const { dropdownTokenSelection } = this.state;
    const tokensOptions = this._getTokensOptions(asset.network);

    const ContractAddress =
      dropdownTokenSelection !== ETHER ? (
        <Input
          ref={this._onInputRef}
          placeholder="Contract address"
          value={asset.token}
          disabled={dropdownTokenSelection !== CUSTOM_TOKEN}
          onInput={this._onAddressChange}
        />
      ) : null;
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Dropdown
            style={{ minWidth: '150px' }}
            placeholder="Network"
            value={asset.network}
            onChange={this._onNetworkChange}
            options={WIDGET_NETWORKS}
          />
          <Dropdown
            style={{ minWidth: '250px' }}
            placeholder="ERC20 Token Address"
            value={dropdownTokenSelection}
            onChange={this._onTokenChange}
            options={tokensOptions}
          />
        </div>
        {ContractAddress}
      </>
    );
  }

  _onNetworkChange = ({ value }) => {
    const dropdownTokenSelection = this._getTokensOptions(value)[0].value;
    this.setState({ dropdownTokenSelection });
    this.props.onChange({ network: value, token: '' });
  }

  _onTokenChange = ({ value }) => {
    this.setState({ dropdownTokenSelection: value });
    const isCustom = value === CUSTOM_TOKEN;
    const token = isCustom ? '' : value;
    this.props.onChange({ network: this.props.asset.network, token, isCustom });

    if (isCustom) {
      setTimeout(() => this.input.input.focus());
    }
  }

  _onAddressChange = (e: React.FormEvent<any>) => {
    const { value } = e.currentTarget;
    this.props.onChange({ network: this.props.asset.network, token: value, isCustom: true });
  }

  _isCustomToken = (network, token) => {
    const tokensOptions = this._getTokensOptions(network);
    return tokensOptions.findIndex(({ value }) => value === token) === -1;
  }

  _getTokensOptions = (network) => {
    return WIDGET_NETWORKS[WIDGET_NETWORKS.findIndex((e) => e.value === network)].tokens;
  }

  _onInputRef = (ref: Input) => this.input = ref;
}
