import React from 'react';
import classnames from 'classnames/bind';

import * as style from './toast.scss';

const cx = classnames.bind(style);

interface IToastProps {
  message: string;
  type: 'success' | 'failure';
}

const Toast = ({ message, type }: IToastProps) => <div className={cx('self', type)}>{message}</div>;

export default Toast;
