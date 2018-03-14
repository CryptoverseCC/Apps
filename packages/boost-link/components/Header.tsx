import React from 'react';

import * as style from './header.scss';

interface IProps {
  positionInSlots: number | null;
  balanceWithDecimalPoint: string;
  symbol: string;
}

const Header = ({ positionInSlots, balanceWithDecimalPoint, symbol }: IProps) => (
  <div className={style.self}>
    <div className={style.positionContainer}>
      {positionInSlots !== null && <div className={style.position}>{positionInSlots + 1}</div>}
      <span className={style.label}>{positionInSlots !== null ? 'In Slot' : 'Approved'}</span>
    </div>
    <p className={style.balance}>
      Your balance:
      <span className={style.amount}>
        {balanceWithDecimalPoint} {symbol}
      </span>
    </p>
  </div>
);

export default Header;
