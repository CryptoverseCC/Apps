import React from 'react';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import * as style from './slide.scss';

const transitionClassNames = {
  enter: style.transitionEnter,
  enterActive: style.transitionEnterActive,
  exit: style.transitionLeave,
  exitActive: style.transitionLeaveActive,
};

const Slide = ({ children, className = '', ...restProps }) => (
  <CSSTransition {...restProps} timeout={300} classNames={transitionClassNames}>
    <div className={classnames(style.container, className)}>{children}</div>
  </CSSTransition>
);

export default Slide;
