import React from 'react';
import classnames from 'classnames';

import * as style from './tooltip.scss';

interface ITooltipProps {
  text?: string;
  children?: JSX.Element;
  className?: string;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
}

const Tooltip = ({ className, style: externalStyle, text, children }: ITooltipProps) => (
  <div style={externalStyle} className={classnames(style.self, className)}>
    {children}
    {text && <div className={style.text}>{text}</div>}
  </div>
);

export default Tooltip;
