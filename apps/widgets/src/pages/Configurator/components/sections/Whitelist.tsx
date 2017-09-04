import { h } from 'preact';

import Input from '@userfeeds/apps-components/src/Input';

import Section from '../Section';

const Whitelist = ({ value, onChange }) => (
  <Section header="Whitelist">
    <Input
      placeholder="Whitelist"
      value={value}
      onInput={onChange}
    />
  </Section>
);

export default Whitelist;
