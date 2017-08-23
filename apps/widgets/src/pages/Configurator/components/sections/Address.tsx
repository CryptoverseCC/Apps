import { h } from 'preact';

import Input from '@userfeeds/apps-components/src/Input';
import Dropdown from '@userfeeds/apps-components/src/Dropdown';

import Section from '../Section';

export const WIDGET_NETWORKS = [
  { value: 'rinkeby', label: 'Rinkeby' },
  { value: 'eth', label: 'Mainnet' },
];

const Address = ({ network, address, onNetworkChange, onAddressChange }) => (
  <Section header="Userfeed address" description="Add description here about userfeed address">
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Dropdown
        style={{ minWidth: '200px' }}
        disabled={false}
        placeholder="Network"
        value={network}
        onChange={onNetworkChange}
        options={WIDGET_NETWORKS}
      />
      <Input
        placeholder="Userfeed Address"
        value={address}
        onChange={onAddressChange}
      />
    </div>
  </Section>
);

export default Address;
