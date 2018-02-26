import React from 'react';
import styled from 'styled-components';

export const Columns = styled.div`
  display: flex;
  box-sizing: border-box;
  margin-left: -0.75rem;
  margin-right: -0.75rem;
  margin-top: -0.75rem;

  &:not(:last-child) {
    margin-bottom: calc(1.5rem - 0.75rem);
  }
`;

export const Column = styled.div`
  box-sizing: border-box;
  flex: ${(props) => (props.size ? '0 0 auto' : '1 1 0')};
  width: ${(props) => (props.size ? props.size / 12 * 100 + '%' : '')};
  padding: 0.75rem;
`;

export const FlexColumn = Column.extend`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => (props.justifyContent ? props.justifyContent : '')};
  align-items: ${(props) => (props.alignItems ? props.alignItems : '')};
`;
