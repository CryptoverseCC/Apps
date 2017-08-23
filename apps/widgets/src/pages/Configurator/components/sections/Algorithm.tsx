import { h } from 'preact';

import Dropdown from '@userfeeds/apps-components/src/Dropdown';

import Section from '../Section';

export const WIDGET_ALGORITHM = [
  { value: 'links', label: 'Ad Ether / total ether - time' },
];

const Algorithm = ({ value, onChange }) => (
  <Section header="Choose algorithm" description="Add description here about algorithms">
    <Dropdown
      disabled
      placeholder="Algorithm"
      value={value}
      onChange={onChange}
      options={WIDGET_ALGORITHM}
    />
  </Section>
);

export default Algorithm;
