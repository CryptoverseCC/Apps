import React, { ReactChild } from 'react';

import { ITokenDetails } from '@linkexchange/token-details-provider';

import * as style from './header.scss';

interface IProps {
  left: ReactChild;
  tokenDetails: ITokenDetails;
}

export const PositionInSlots = ({ position }) => (
  <div className={style.positionContainer}>
    {position !== null && <div className={style.position}>{position + 1}</div>}
    <span className={style.label}>{position !== null ? 'In Slot' : 'Approved'}</span>
  </div>
);

export const Balance = ({ tokenDetails }) => (
  <p className={style.balance}>
    Your balance:
    <span className={style.amount}>
      {tokenDetails.balanceWithDecimalPoint} {tokenDetails.symbol}
    </span>
  </p>
);

const Header = ({ left, tokenDetails }: IProps) => (
  <div className={style.self}>
    {left}
    <Balance tokenDetails={tokenDetails} />
  </div>
);

export default Header;
