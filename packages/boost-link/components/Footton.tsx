import React from 'react';
import classnames from 'classnames/bind';

import MetaFox from '@linkexchange/transaction-provider/metafox.png';

import * as style from './footon.scss';
const cx = classnames.bind(style);

interface IProps {
  type: 'confirm' | 'metamask';
}

const Footton = ({ type, ...restProps }: IProps) => (
  <div className={cx(style.self, { [type]: true })} {...restProps}>
    {type === 'confirm' ? 'Confirm' : (
      <>
        <img src={MetaFox} style={{ height: '2em' }} />
        Metamask...
      </>
    )}
  </div>
);

export default Footton;
