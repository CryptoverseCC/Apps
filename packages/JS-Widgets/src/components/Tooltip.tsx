import { h } from 'preact';
import * as classnames from 'classnames';

import * as style from './tooltip.scss';

interface ITooltipProps {
  text: string;
  children: JSX.Element;
  className?: string;
}

const Tooltip = ({ className, text, children }: ITooltipProps) => (
  <div class={classnames(style.self, className)}>
    {children}
    <div class={style.text}>{text}</div>
  </div>
);

export default Tooltip;
