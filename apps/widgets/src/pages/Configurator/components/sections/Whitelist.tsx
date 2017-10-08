import React from 'react';

import Input from '@userfeeds/apps-components/src/Input';

import Section from '../Section';

const Whitelist = ({ value, onChange }) => (
  <Section header="Whitelist" description="Add description here about whitelist identifier">
    <Input
      placeholder="Whitelist"
      value={value}
      onInput={onChange}
    />
  </Section>
);

export default Whitelist;
