import { h } from 'preact';

import Input from '@userfeeds/apps-components/src/Input';

import Section from '../Section';

const Description = ({ value, onChange }) => (
  <Section header="Description" description="Add description here about description">
    <Input
      multiline
      placeholder="Description"
      value={value}
      onInput={onChange}
    />
  </Section>
);

export default Description;
