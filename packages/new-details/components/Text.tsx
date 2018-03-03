import React from 'react';
import styled from 'styled-components';

export const BlackText = styled.span`
  color: #000000;
  font-size: 18px;
  font-weight: normal;
`;

export const SmallBlackText = BlackText.extend`
  font-size: 14px;
`;

export const LightGreyText = BlackText.extend`
  color: #a6aeb8;
`;

export const BlackBoldText = BlackText.extend`
  font-weight: bold;
`;

export const SmallBlackBoldText = BlackBoldText.extend`
  font-size: 14px;
`;

export const BlueBoldText = BlackBoldText.extend`
  color: #263fff;
`;
