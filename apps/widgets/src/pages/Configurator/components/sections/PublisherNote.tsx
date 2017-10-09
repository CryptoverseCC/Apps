import React from 'react';

import Input from '@userfeeds/apps-components/src/Input';

import Section from '../Section';

const PublisherNote = ({ value, onChange }) => (
  <Section header="Publisher note">
    <Input
      placeholder="Publisher note"
      value={value}
      onInput={onChange}
    />
  </Section>
);

export default PublisherNote;
