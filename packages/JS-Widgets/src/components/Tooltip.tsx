import { h } from 'preact';
import * as classnames from 'classnames';

import * as style from './tooltip.scss';

interface ITooltipProps {
  text?: string;
  children: JSX.Element;
  class?: string;
  style?: string | { [key: string]: number | string };
}

const Tooltip = ({ class: className, style: externalStyle, text, children }: ITooltipProps) => (
  <div style={externalStyle} class={classnames(style.self, className)}>
    {children}
    {text && <div class={style.text}>{text}</div>}
  </div>
);

export default Tooltip;
