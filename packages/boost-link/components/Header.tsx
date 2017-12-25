import React from 'react';

import { ITokenDetails } from '@linkexchange/token-details-provider';

import * as style from './header.scss';

interface IProps {
  positionInSlots: number | null;
  tokenDetails: ITokenDetails;
}

const Header = ({ positionInSlots, tokenDetails }: IProps) => (
  <div className={style.self}>
    <div className={style.positionContainer}>
      {positionInSlots !== null && <div className={style.position}>{positionInSlots + 1}</div>}
      <span className={style.label}>{positionInSlots !== null ? 'In Slot' : 'Approved'}</span>
    </div>
    <p className={style.balance}>
      Your balance:
      <span className={style.amount}>{tokenDetails.balanceWithDecimalPoint} {tokenDetails.symbol}</span>
    </p>
  </div>
);

export default Header;
