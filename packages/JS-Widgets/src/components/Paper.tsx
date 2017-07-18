import { h, FunctionalComponent } from 'preact';

import * as style from './paper.scss';

const Paper: FunctionalComponent<JSX.HTMLAttributes> = (props) => (
  <div {...props} class={style.self} />
);

export default Paper;
