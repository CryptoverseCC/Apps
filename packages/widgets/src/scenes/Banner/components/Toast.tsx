import React from 'react';
import classnames from 'classnames/bind';

import Icon from '@linkexchange/components/src/Icon';

import * as style from './toast.scss';

const cx = classnames.bind(style);

interface IToastProps {
  message: string;
  type: 'success' | 'failure';
  onClose(message: string): void;
}

const Toast = ({ message, type, onClose }: IToastProps) => {
  const onClick = onClose.bind(null, message);

  return <div className={cx('self', type)}>{message}</div>;
};

export default Toast;
