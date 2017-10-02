import { h, Component } from 'preact';

import Input from '@userfeeds/apps-components/src/Input';
import Dropdown from '@userfeeds/apps-components/src/Dropdown';

import Section from '../Section';

export const ETH = 'eth';
export const CUSTOM_TOKEN = 'custom';
const OTHER_ERC20_TOKEN = { value: CUSTOM_TOKEN, label: 'Other ERC20 Token' };

export const WIDGET_NETWORKS = [
  { value: 'ethereum', label: 'Mainnet', tokens: [
    { value: ETH, label: 'ETH' },
    { value: '0xE41d2489571d322189246DaFA5ebDe1F4699F498', label: 'ZRX' },
    OTHER_ERC20_TOKEN,
  ] },
  { value: 'rinkeby', label: 'Rinkeby', tokens: [
    { value: ETH, label: 'ETH (rinkeby)' },
    { value: '0xE41d2489571d322189246DaFA5ebDe1F4699F499', label: 'STH' },
    OTHER_ERC20_TOKEN,
  ] },
  { value: 'kovan', label: 'Kovan', tokens: [
    { value: ETH, label: 'ETH (kovan)' },
    { value: '0xE41d2489571d322189246DaFA5ebDe1F4699F500', label: 'XXX Coin' },
    { value: '0xE41d2489571d322189246DaFA5ebDe1F4699F501', label: 'YYY Token' },
    { value: '0xE41d2489571d322189246DaFA5ebDe1F4699F502', label: 'ZZZ Coin' },
    OTHER_ERC20_TOKEN,
  ] },
];

interface ITokenProps {
  network: string;
  onNetworkChange(network: {value: string; });
  token: string;
  onTokenChange(token: { value: string; });
}

interface ITokenState {
  token: string;
  tokenAddress?: string;
}

export default class Token extends Component<ITokenProps, ITokenState> {

  constructor(props) {
    super(props);

    const token = this._isCustomToken(props.network, props.token) ? CUSTOM_TOKEN : props.token;
    this.state = { token, tokenAddress: props.token };
  }

  render({ network, onNetworkChange, onTokenChange }, { token, tokenAddress }) {
    const tokensOptions = WIDGET_NETWORKS[WIDGET_NETWORKS.findIndex((e) => e.value === network)].tokens;

    return (
      <Section header="Choose token" description="Add description here about tokens">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Dropdown
            style={{ minWidth: '200px' }}
            placeholder="Network"
            value={network}
            onChange={onNetworkChange}
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
        {token === CUSTOM_TOKEN && <Input
          placeholder="Contract address"
          value={tokenAddress}
          onInput={this._onAddressChange}
        />}
      </Section>
    );
  }

  _isCustomToken = (network, token) => {
    const tokensOptions = WIDGET_NETWORKS[WIDGET_NETWORKS.findIndex((e) => e.value === network)].tokens;
    return tokensOptions.findIndex(({ value }) => value === token) === -1;
  }

  _onAddressChange = (e: Event) => {
    const value = e.target.value;
    this.setState({ tokenAddress: value });
    this.props.onTokenChange({ value });
  }

  _onTokenChange = ({ value }) => {
    this.setState({ token: value, tokenAddress: '' });

    if (value !== CUSTOM_TOKEN) {
      this.props.onTokenChange(value);
    }
  }
}
