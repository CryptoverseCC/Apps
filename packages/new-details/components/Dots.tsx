import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { styledComponentWithProps } from '../utils';

const Dot = styledComponentWithProps<{ color: string }, HTMLDivElement>(styled.div)`
  display: inline-block;
  height: 10px;
  width: 10px;
  border-radius: 10px;
  background-color: ${(props) => props.color};
`;

const LinkexchangeDots = (props: HTMLAttributes<HTMLDivElement>) => (
  <div style={{ minWidth: '30px', cursor: 'pointer' }} {...props}>
    <Dot color="#5772FF" />
    <Dot color="#FF5A6B" style={{ marginLeft: '5px' }} />
  </div>
);

export default LinkexchangeDots;
