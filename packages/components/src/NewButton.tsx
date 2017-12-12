import React from 'react';
import classnames from 'classnames';

import { isType } from '@linkexchange/utils';

import * as style from './newButton.scss';

type TButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'small' | 'medium';
  color?: 'primary' | 'secondary' | 'success' | 'pending' | 'metaPending' | 'error' | 'ready' | 'empty';
  outline?: boolean;
};

const Button = ({ children, className, outline, size = 'medium', color = 'empty', ...props }: TButtonProps) => {
  let icon;
  const decoratedChildren = React.Children.map(children, (child) => {
    if (isType(child, 'Icon')) {
      icon = React.cloneElement(child, { displayName: undefined, className: style.ButtonIcon });
      return null;
    } else {
      return child;
    }
  });
  return (
    <button
      className={classnames(style.Button, className, style[size], style[color], {
        [style.outline]: outline,
      })}
      {...props}
    >
      <div className={style.ButtonInnerWrapper}>
        {icon}
        <div className={style.Children}>{decoratedChildren}</div>
      </div>
    </button>
  );
};

export default Button;
