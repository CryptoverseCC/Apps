import { h } from 'preact';

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

const Token = ({ network, onNetworkChange, token, onTokenChange }) => (
  <Section header="Choose token" description="Add description here about tokens">
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Dropdown
        style={{ minWidth: '200px' }}
        disabled={false}
        placeholder="Network"
        value={network}
        onChange={onNetworkChange}
        options={WIDGET_NETWORKS}
      />
      <Dropdown
        style={{ minWidth: '200px' }}
        placeholder="ERC20 Token Address"
        value={token}
        onChange={onTokenChange}
        options={WIDGET_NETWORKS[WIDGET_NETWORKS.findIndex((e) => e.value === network)].tokens}
      />
    </div>
  </Section>
);

export default Token;
