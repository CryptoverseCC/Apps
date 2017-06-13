import { h } from 'preact';

import './button.css';

const Button = ({ children, ...restProps }) => {
  return <button class="button" {...restProps}>{children}</button>;
};

export default Button;
