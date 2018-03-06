import React from 'react';
import Result from '@linkexchange/components/src/Result';
import styled from 'styled-components';
import { Column, Columns } from '@linkexchange/components/src/Columns';
import A from '@linkexchange/components/src/A';

const Items = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: left;
  font-size: 16px;
  margin-bottom: 30px;
`;

const Subheader = styled.p`
  margin: 0;
  padding: 0;
  font-size: 18px;
  line-height: 28px;
  & + ${Items} {
    margin-top: 30px;
  }
`;

const ItemTitle = styled.span`
  color: #a6aeb8;
`;

const Item = styled(Columns.withComponent('li'))`
  &:not(:first-of-type) {
    margin-top: 20px;
  }
`;

const ItemWithLabelAndValue = ({ label, value }) => (
  <Item>
    <Column size={4} withoutPadding={false}>
      <ItemTitle>{label}</ItemTitle>
    </Column>
    <Column size={8} withoutPadding={false}>
      {value}
    </Column>
  </Item>
);

const ActionSuccess = ({ showStatus, title, description, address, value, currency }) => (
  <Result onClick={showStatus} type="success">
    <h2>Congratulations!</h2>
    <Subheader>
      Your transaction has been sent.<br />
      Boost your link to increase its visibility.
    </Subheader>
    <Items>
      <ItemWithLabelAndValue label="Title" value={title} />
      <ItemWithLabelAndValue label="Description" value={description} />
      <ItemWithLabelAndValue label="Address" value={<A href={address}>{address}</A>} />
      <ItemWithLabelAndValue label="Fee" value={`${value} ${currency}`} />
    </Items>
  </Result>
);

export default ActionSuccess;
