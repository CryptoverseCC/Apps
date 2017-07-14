import { h, FunctionalComponent } from 'preact';

import * as style from './paper.scss';

const Paper = ({ children, style: externalStyle }) => (
  <div class={style.self} style={externalStyle}>
    {children}
  </div>
);

export default Paper;
