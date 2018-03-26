import React from 'react';
import styled from 'styled-components';
import Blockies from 'react-blockies';

import TokenLogo from '@linkexchange/components/src/TokenLogo';

const IconContainer = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 100%;
  overflow: hidden;
  box-shadow: 0 9px 20px 0 rgba(38, 63, 255, 0.11);
  transition-duration: 0.3s;

  :hover {
    border-radius: 8px;
  }
`;

const Identicon = (props: { address: string; onClick?: () => void }) => (
  <IconContainer onClick={props.onClick}>
    <Blockies seed={props.address} scale={8} />
  </IconContainer>
);

const TokenLogoContainer = styled.div`
  position: absolute;
  box-sizing: border-box;
  border-radius: 100%;
  top: 38px;
  left: 12px;
  width: 40px;
  padding: 5px;
  height: 40px;
  background-color: #ffffff;
`;

const StyledTokenLogo = styled(TokenLogo)`
  width: 100%;
  height: 100%;
`;

const A = styled.p`
  cursor: pointer;
  white-space: nowrap;
  color: #263fff;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  letter-spacing: 0.1px;
`;

const openEtherscanAccount = (address: string, asset: string) => () => {
  const [network, token] = asset.split(':');
  window.open(
    `https://${network !== 'ethereum' ? network + '.' : ''}etherscan.io/address/${address}${
      !token ? '#internaltx' : '#tokentxns'
    }`,
    '_blank',
  );
};

const openEtherscanToken = (asset: string) => () => {
  const [network, token] = asset.split(':');

  if (!token) {
    return;
  }

  window.open(`https://${network !== 'ethereum' ? network + '.' : ''}etherscan.io/token/${token}`, '_blank');
};

const IdenticonWithToken = (props: { address: string; asset: string } & React.HTMLAttributes<HTMLDivElement>) => {
  const { address, asset, ...restProps } = props;
  const [, token] = asset.split(':');
  return (
    <div {...restProps}>
      <Identicon address={address} onClick={openEtherscanAccount(address, asset)} />
      <TokenLogoContainer onClick={openEtherscanToken(asset)}>
        <StyledTokenLogo asset={asset} />
      </TokenLogoContainer>
      <A onClick={openEtherscanAccount(address, asset)} style={{ marginTop: '20px' }}>
        Host address
      </A>
      {token && <A onClick={openEtherscanToken(asset)}>Token</A>}
    </div>
  );
};

const StyledIdenticonWithToken = styled(IdenticonWithToken)`
  position: relative;
  margin-bottom: 14px;
  margin-bottom: 40px;
`;

export default StyledIdenticonWithToken;
