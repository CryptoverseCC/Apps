import React from 'react';
import { isType } from '@userfeeds/utils/src/index';
import * as style from './newButton.scss';
import classnames from 'classnames';

type TButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'small' | 'medium';
  color?: 'primary' | 'success';
  outline?: boolean;
};

const Button = ({
  children,
  className,
  outline,
  size = 'medium',
  color = 'primary',
  ...props,
}: TButtonProps) => {
  const decoratedChildren = React.Children.map(
    children,
    (child) =>
      isType(child, 'Icon') ? React.cloneElement(child, { className: style.ButtonIcon }) : child,
  );
  return (
    <button
      className={classnames(style.Button, className, style[size], style[color], {
        [style.outline]: outline,
      })}
      {...props}
    >
      <div className={style.ButtonInnerWrapper}>{decoratedChildren}</div>
    </button>
  );
};

export default Button;
