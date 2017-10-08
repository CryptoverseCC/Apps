import React from 'react';

import Input from '@userfeeds/apps-components/src/Input';

import Section from '../Section';

const Address = ({ recipientAddress, onRecipientAddressChange }) => (
  <Section header="Userfeed address" description="Add description here about userfeed address">
    <Input
      placeholder="Userfeed Address"
      value={recipientAddress}
      onInput={onRecipientAddressChange}
    />
  </Section>
);

export default Address;
