import { h, FunctionalComponent } from 'preact';

import * as style from './button.scss';

const Button: FunctionalComponent<JSX.HTMLAttributes> = ({ children, ...restProps }) => {
  return <button class={style.self} {...restProps}>{children}</button>;
};

export default Button;
