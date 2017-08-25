import { h } from 'preact';
import * as classnames from 'classnames/bind';

import * as style from './button.scss';

const cx = classnames.bind(style);

type TButtonProps = JSX.HTMLAttributes & {
  secondary?: boolean;
};

const Button = ({ class: className, secondary = false, ...restProps }: TButtonProps) => (
  <button class={cx(style.self, className, { secondary })} {...restProps} />
);

export default Button;
