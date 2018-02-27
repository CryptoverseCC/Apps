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
  border-radius: 100%;
  top: 38px;
  left: 12px;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.8);

  :hover {
    transition-duration: 0.3s;
    background-color: rgba(255, 255, 255, 1);
  }
`;

const StyledTokenLogo = styled(TokenLogo)`
  width: 100%;
  height: 100%;
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

const IdenticonWithToken = ({ className, address, asset }: { className?: string; address: string; asset: string }) => (
  <div className={className}>
    <Identicon address={address} onClick={openEtherscanAccount(address, asset)} />
    <TokenLogoContainer onClick={openEtherscanToken(asset)}>
      <StyledTokenLogo asset={asset} />
    </TokenLogoContainer>
  </div>
);

const StyledIdenticonWithToken = styled(IdenticonWithToken)`
  position: relative;
  margin-bottom: 14px;
  cursor: pointer;
`;

export default StyledIdenticonWithToken;
