import { h } from 'preact';

import style from './button.scss';

const Button = ({ children, ...restProps }) => {
  return <button class={style.this} {...restProps}>{children}</button>;
};

export default Button;
