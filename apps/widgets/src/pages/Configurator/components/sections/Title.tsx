import React from 'react';

import Input from '@userfeeds/apps-components/src/Input';

import Section from '../Section';

const Title = ({ value, onChange }) => (
  <Section header="Title" description="Add description here about title">
    <Input
      placeholder="Title"
      value={value}
      onInput={onChange}
    />
  </Section>
);

export default Title;
