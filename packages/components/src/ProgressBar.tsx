import React from 'react';
import classnames from 'classnames';

import * as style from './progressBar.scss';

interface IProps {
  progress: number | string;
  className?: string;
  fillClassName?: string;
  fillStyle?: React.CSSProperties;
}

const ProgressBar = ({ progress, className, fillClassName, fillStyle }: IProps) => {
  return (
    <div className={classnames(style.self, className)}>
      <div className={classnames(style.fill, fillClassName)} style={{ ...fillStyle, width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;
