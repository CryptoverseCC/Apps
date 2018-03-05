import React from 'react';
import styled from 'styled-components';

const Linkexchange = styled.span`
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  color: #1b2437;
`;

const PoweredBy = Linkexchange.extend`
  font-size: 13px;
  font-weight: normal;
`;

const PoweredByLinkexchange = (props: React.HtmlHTMLAttributes<HTMLDivElement>) => (
  <div {...props}>
    <PoweredBy>Powered by</PoweredBy>
    <Linkexchange>Link Exchange</Linkexchange>
  </div>
);

export default PoweredByLinkexchange;
