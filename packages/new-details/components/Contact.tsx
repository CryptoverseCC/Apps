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
  width: 79px;
  height: 36px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 9px 20px 0 rgba(38, 63, 255, 0.11);
  color: #263fff;
  font-size: 12px;
  font-weight: bold;
  text-align: center;

  :disabled {
    cursor: not-allowed;
    background-image: linear-gradient(to right, #ffffff, #f5f7fa);
    box-shadow: none;
    border: solid 1px #d9e0e7;
    color: #89939f;
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
