import { h, FunctionalComponent } from 'preact';

import * as style from './button.scss';

const Button: FunctionalComponent<JSX.HTMLAttributes> = (props) => {
  return <button class={style.self} {...props} />;
};

export default Button;
