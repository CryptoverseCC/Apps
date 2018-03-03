import React from 'react';
import styled from 'styled-components';

import { styledComponentWithProps } from '../utils';

export const Columns = styled.div`
  display: flex;
  box-sizing: border-box;
`;

export const Column = styledComponentWithProps<{ size?: number }, HTMLDivElement>(styled.div)`
  box-sizing: border-box;
  flex: ${(props) => (props.size ? '0 0 auto' : '1 1 0')};
  width: ${(props) => (props.size ? props.size / 12 * 100 + '%' : '')};
  padding: 0.75rem;
`;

export const FlexColumn = styledComponentWithProps<{
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
}>(Column.extend)`
  display: flex;
  flex-direction: ${(props) => (props.flexDirection ? props.flexDirection : 'column')};
  justify-content: ${(props) => (props.justifyContent ? props.justifyContent : '')};
  align-items: ${(props) => (props.alignItems ? props.alignItems : '')};
`;
