import { h, FunctionalComponent } from 'preact';
import * as classnames from 'classnames';

import * as style from './paper.scss';

const Paper: FunctionalComponent<JSX.HTMLAttributes> = ({ class: className, ...restProps }) => (
  <div {...restProps} class={classnames(className, style.self)} />
);

export default Paper;
