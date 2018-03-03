import React from 'react';
import styled from 'styled-components';

import { R } from '@linkexchange/utils/validation';
import Tooltip from '@linkexchange/components/src/Tooltip';

const A = styled.a`
  text-decoration: none;
`;

const ContactPublisherButton = styled.button`
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 9px 20px 0 rgba(38, 63, 255, 0.11);
  padding: 5px 8px;
  border: 1px solid #d9e0e7;
  border-radius: 8px;
  color: #263fff;
  font-weight: bold;

  :disabled {
    cursor: not-allowed;
    opacity: 0.7;
    color: #d9e0e7;
  }
`;

const ContactPublisher = (props: { contactMethod?: string }) => {
  const { contactMethod } = props;

  if (!contactMethod) {
    return <ContactPublisherButton disabled>Contact</ContactPublisherButton>;
  }

  const isURL = !R.link('', contactMethod);
  const isEmail = !isURL && !R.email(contactMethod);

  if (isURL || isEmail) {
    return (
      <A href={isURL ? contactMethod : `mailto:${contactMethod}`} target="_blank">
        <ContactPublisherButton>Contact</ContactPublisherButton>
      </A>
    );
  }

  return (
    <Tooltip text={contactMethod}>
      <ContactPublisherButton>Contact</ContactPublisherButton>
    </Tooltip>
  );
};

export default ContactPublisher;
