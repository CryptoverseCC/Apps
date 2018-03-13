import React from 'react';
import styled, { keyframes } from 'styled-components';

import LonelyBlock from '@linkexchange/components/src/LonelyBlock';
import { Columns, Column, FlexColumn } from '@linkexchange/components/src/Columns';

import { BigBlackBoldText, LightGreyText, BlackBoldText } from './Text';
import { mobileOrTablet } from '@linkexchange/utils/userAgent';

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 410px;
`;

const LonelyText = LightGreyText.extend`
  font-style: italic;
  font-weight: bold;
`;

const Empty: React.SFC<{ mobile?: boolean; style?: any }> = ({ mobile, style, children }) => (
  <Columns>
    {!mobile && <Column size={1} />}
    <FlexColumn size={mobile ? 12 : 8}>
      <EmptyContainer style={style}>
        <LonelyBlock />
        {children}
      </EmptyContainer>
    </FlexColumn>
  </Columns>
);

export const NoLinks: React.SFC<{ mobile?: boolean; addLink?: JSX.Element }> = (props) => {
  const { mobile, addLink } = props;
  const decoratedAddLink = addLink ? React.cloneElement(addLink, { children: 'Add the first one' }) : null;

  return (
    <Empty
      mobile={mobile}
      style={{
        backgroundColor: '#f5f7fa',
      }}
    >
      <LonelyText style={{ margin: '15px 0 20px 0' }}>Another lonely block</LonelyText>
      <BigBlackBoldText style={{ marginBottom: '15px' }}>No links, yet.</BigBlackBoldText>
      {!mobile && decoratedAddLink}
    </Empty>
  );
};

NoLinks.defaultProps = {
  mobile: mobileOrTablet(),
};

export const Loading: React.SFC<{ mobile?: boolean }> = ({ mobile }) => (
  <Empty mobile={mobile}>
    <BlackBoldText>Links loading</BlackBoldText>
  </Empty>
);

Loading.defaultProps = {
  mobile: mobileOrTablet(),
};
