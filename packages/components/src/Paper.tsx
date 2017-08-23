import { h, FunctionalComponent } from 'preact';
import * as classnames from 'classnames';

import * as style from './paper.scss';

interface IPaperProps {
  class?: string;
}

const Paper: FunctionalComponent<IPaperProps> = ({ class: className, children }) => (
  <div class={classnames(className, style.self)}>
    {children}
  </div>
);

export default Paper;
