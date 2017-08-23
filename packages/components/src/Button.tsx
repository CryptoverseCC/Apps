import { h } from 'preact';
import * as classnames from 'classnames/bind';

import * as style from './button.scss';

const cx = classnames.bind(style);

const Button = ({ class: className, ...restProps}: JSX.HTMLAttributes) => (
  <button class={cx('self', className)} {...restProps} />
);

export default Button;
