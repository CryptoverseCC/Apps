import React from 'react';
import * as style from './button.scss';

const Button = ({ children, ...props }) => {
  const decoratedChildren = React.Children.map(children, (child) => {
    return child && child.props && child.props.displayName === 'Icon'
      ? React.cloneElement(child, { className: style.ButtonIcon })
      : child;
  });
  return (
    <button className={style.Button} {...props}>
      <div className={style.ButtonInnerWrapper}>{decoratedChildren}</div>
    </button>
  );
};

export default Button;
