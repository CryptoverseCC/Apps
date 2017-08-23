import { h, FunctionalComponent } from 'preact';
import * as classnames from 'classnames';

import * as style from './buttonSecondary.scss';

const buttonSecondary: FunctionalComponent<JSX.HTMLAttributes> = (props) => {
  const { class: className, ...restProps } = props;

  return <button class={classnames(style.self, className)} {...restProps} />;
};

export default buttonSecondary;
