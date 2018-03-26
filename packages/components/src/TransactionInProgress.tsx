import React from 'react';

import MetaFox from '@linkexchange/images/metafox_straight.png';

import * as style from './transactionInProgress.scss';

const Confirmation: React.SFC<{}> = ({ children }) => (
  <div className={style.self}>
    <div className={style.foxoader}>
      <img src={MetaFox} className={style.fox} />
      <div className={style.loader} />
    </div>
    <div className={style.body}>{children}</div>
  </div>
);

export default Confirmation;
