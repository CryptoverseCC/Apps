import { h } from 'preact';

import Input from '@userfeeds/apps-components/src/Input';

import Section from '../Section';

const Contact = ({ value, onChange }) => (
  <Section header="Prefered contact method">
    <Input
      placeholder="Contact method"
      value={value}
      onChange={onChange}
    />
  </Section>
);

export default Contact;
