import React from 'react';
import classnames from 'classnames/bind';

import Icon from '@linkexchange/components/src/Icon';
import Button from '@linkexchange/components/src/NewButton';

import * as style from './result.scss';
const cx = classnames.bind(style);

interface IProps {
  onClick(): void;
  type: 'success' | 'failure';
}

const Success: React.SFC<IProps> = ({ type, onClick, children }) => (
  <div className={style.self}>
    <Icon name={type === 'success' ? 'check' : 'x'} className={cx(style.icon, { [type]: true })} />
    <div>{children}</div>
    <Button color="primary" className={style.button} onClick={onClick}>
      {type === 'success' ? 'Check Status' : 'Try again'}
    </Button>
  </div>
);

export default Success;
