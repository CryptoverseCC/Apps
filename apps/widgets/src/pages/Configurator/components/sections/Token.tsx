import { h } from 'preact';

import Dropdown from '@userfeeds/apps-components/src/Dropdown';

import Section from '../Section';

export const WIDGET_TOKENS = [
  { value: 'eth', label: 'ETH Ethereum' },
];

const Token = ({ value, onChange }) => (
  <Section header="Choose token" description="Add description here about tokens">
    <Dropdown
      disabled
      placeholder="Token"
      value={value}
      onChange={onChange}
      options={WIDGET_TOKENS}
    />
  </Section>
);

export default Token;
