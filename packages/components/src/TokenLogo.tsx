import React from 'react';

import * as bat from '../images/bat.png';
import * as eos from '../images/eos.png';
import * as erc20 from '../images/erc20.png';
import * as ethereum from '../images/ethereum.png';
import * as kyber from '../images/kyber.png';
import * as maker from '../images/maker.png';
import * as metalpay from '../images/metalpay.png';
import * as omise from '../images/omise.png';
import * as qtum from '../images/qtum.png';
import * as rep from '../images/rep.png';
import * as status from '../images/status.png';
import * as tenx from '../images/tenx.png';
import * as zerox from '../images/zerox.png';

const assetToIconMap = new Map([
  ['ethereum', ethereum],
  ['ropsten', ethereum],
  ['rinkeby', ethereum],
  ['kovan', ethereum],
  ['ethereum:0xd26114cd6ee289accf82350c8d8487fedb8a0c07', omise],
  ['ethereum:0x9a642d6b3368ddc662ca244badf32cda716005bc', qtum],
  ['ethereum:0xc66ea802717bfb9833400264dd12c2bceaa34a6d', maker],
  ['ethereum:0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0', eos],
  ['ethereum:0xb97048628db6b661d4c2aa833e95dbe1a905b280', tenx],
  ['ethereum:0xe94327d07fc17907b4db788e5adf2ed424addff6', rep],
  ['ethereum:0x0d8775f648430679a709e98d2b0cb6250d2887ef', bat],
  ['ethereum:0xdd974d5c2e2928dea5f71b9825b8b646686bd200', kyber],
  ['ethereum:0xf433089366899d83a9f26a773d59ec7ecf30355e', metalpay],
  ['ethereum:0xe41d2489571d322189246dafa5ebde1f4699f498', zerox],
  ['ethereum:0x744d70fdbe2ba4cf95131626614a1763df805b9e', status],
  ['ropsten:0x6bdb3998972ad6f7a740523ccd3de7b0b8a4a6c5', omise],
]);

interface ITokenLogoProps {
  className?: string;
  asset: string;
}

const TokenLogo = ({ asset, className }: ITokenLogoProps) => {
  const icon = assetToIconMap.get(asset) || erc20;
  return <img className={className} src={icon} />;
};

export default TokenLogo;
