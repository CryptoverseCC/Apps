import React from 'react';
import styled from 'styled-components';

import { styledComponentWithProps } from '../utils';

const Hr = styled.div`
  width: 100%;
  height: 1px;
  background-color: #d9e0e7;
`;

export const FancyHr = styledComponentWithProps<{ left?: boolean }, HTMLDivElement>(Hr.extend)`
  background: ${(props) =>
    props.left
      ? 'linear-gradient(to left, rgba(116, 95, 181, 0.2), transparent 80%)'
      : 'linear-gradient(to right, rgba(116, 95, 181, 0.2), transparent 80%)'};
`;

export default Hr;
