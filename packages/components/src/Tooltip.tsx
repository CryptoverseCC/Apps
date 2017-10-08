import React from 'react';
import classnames from 'classnames';

import * as style from './tooltip.scss';

interface ITooltipProps {
  text?: string;
  children?: JSX.Element;
  className?: string;
  style?: string | { [key: string]: number | string };
}

const Tooltip = ({ className, style: externalStyle, text, children }: ITooltipProps) => (
  <div style={externalStyle} className={classnames(style.self, className)}>
    {children}
    {text && <div className={style.text}>{text}</div>}
  </div>
);

export default Tooltip;
