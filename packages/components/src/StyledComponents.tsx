import React from 'react';
import styled, { css } from 'styled-components';

const shadow = css`
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.25);
`;

const Modal = styled.div`
  ${shadow}
  border-radius: 3px;
  min-height: 350px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  padding: 20px 40px;
  display: flex;
  align-items: center;
`;

export const HeaderRight = styled.div`
  margin-left: auto;
`;

export const Title = styled.div`
  color: #1b2437;
  font-size: 22px;
  font-weight: bold;
`;

export const Body = styled.div`
  padding: 20px 40px 0;
`;

export const Footer = styled.div`
  padding: 10px 40px;
`;

export const Error = styled.div`
  background-color: #FEE5EA;
  color: #FC0035;
  font-size: 14px;
  font-weight: bold;
  line-height: 20px;
  padding: 10px 40px;
`

export const FooterText = styled.p`
  color: #A6AEB8;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
`;

export const BalanceLabel = styled.span``;

export const BalanceValue = styled.span``;

export const Balance = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 11px;
  text-align: right;

  ${BalanceLabel} {
    color: #a5acb7;
    line-height: 14px;
  }

  ${BalanceValue} {
    margin-left: 5px;
    color: #1b2437;
  }
`;

export default Modal;
