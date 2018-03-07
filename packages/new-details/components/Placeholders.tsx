import React from 'react';
import styled, { keyframes } from 'styled-components';

import { Columns, Column, FlexColumn } from '@linkexchange/components/src/Columns';

import { BigBlackBoldText, LightGreyText, BlackBoldText } from './Text';
import { mobileOrTablet } from '@linkexchange/utils/userAgent';

const boxAnimation = keyframes`
  17% { border-bottom-right-radius: 3px; }
  25% { transform: translateY(9px) rotate(22.5deg); }
  50% {
    transform: translateY(18px) scale(1,.9) rotate(45deg) ;
    border-bottom-right-radius: 40px;
  }
  75% { transform: translateY(9px) rotate(67.5deg); }
  100% { transform: translateY(0) rotate(90deg); }
`;

const Box = styled.div`
  width: 50px;
  height: 50px;
  background: #263fff;
  animation: ${boxAnimation} 1s linear infinite;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 3px;
`;

const shadowAnimation = keyframes`
  50% {
    transform: scale(1.2,1);
  }
`;

const Shadow = styled.div`
  width: 50px;
  height: 5px;
  background: #e9ebff;
  opacity: 1;
  position: absolute;
  top: 59px;
  left: 0;
  border-radius: 50%;
  animation: ${shadowAnimation} 1s linear infinite;
`;

const LonelyBlock = styled((props) => (
  <div {...props}>
    <Shadow />
    <Box />
  </div>
))`
  position: relative;
  width: 60px;
  height: 60px;
  margin: 15px;
`;

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
