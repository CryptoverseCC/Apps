import React from 'react';
import * as classnames from 'classnames/bind';

import * as style from './button.scss';

const cx = classnames.bind(style);

type TButtonProps = JSX.HTMLAttributes & {
  secondary?: boolean;
};

const Button = ({ className, secondary = false, ...restProps }: TButtonProps) => (
  <button className={cx(style.self, className, { primary: !secondary, secondary })} {...restProps} />
);

export default Button;
