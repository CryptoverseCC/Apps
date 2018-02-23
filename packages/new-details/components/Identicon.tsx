import React from 'react';
import Blockies from 'react-blockies';
import styled from 'styled-components';

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 100%;
  overflow: hidden;
  box-shadow: 0 9px 20px 0 rgba(38, 63, 255, 0.11);
`;

const Identicon = (props: { address: string }) => (
  <IconContainer>
    <Blockies seed={props.address} scale={6} />
  </IconContainer>
);

export default Identicon;
