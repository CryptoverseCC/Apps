import React from 'react';
import { isType } from '@userfeeds/utils/src/index';
import * as style from './newButton.scss';

const Button = ({ children, ...props }) => {
  const decoratedChildren = React.Children.map(
    children,
    (child) =>
      isType(child, 'Icon') ? React.cloneElement(child, { className: style.ButtonIcon }) : child,
  );
  return (
    <button className={style.Button} {...props}>
      <div className={style.ButtonInnerWrapper}>{decoratedChildren}</div>
    </button>
  );
};

export default Button;
