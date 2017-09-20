import { h } from 'preact';

import Input from '@userfeeds/apps-components/src/Input';

import Section from '../Section';

const Address = ({ userfeed, onUserfeedChange }) => (
  <Section header="Userfeed address" description="Add description here about userfeed address">
    <Input
      placeholder="Userfeed Address"
      value={userfeed}
      onInput={onUserfeedChange}
    />
  </Section>
);

export default Address;
