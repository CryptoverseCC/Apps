import { h, FunctionalComponent } from 'preact';
import * as classnames from 'classnames';

import * as style from './button.scss';

const Button: FunctionalComponent<JSX.HTMLAttributes> = (props) => {
  const { class: className, ...restProps } = props;

  return <button class={classnames(style.self, className)} {...restProps} />;
};

export default Button;
