import React from 'react';
import classnames from 'classnames';

import * as style from './progressBar.scss';

interface IProps {
  progress: number | string;
  className?: string;
  fillClassName?: string;
}

const ProgressBar = ({ progress, className, fillClassName }: IProps) => {
  return (
    <div className={classnames(style.self, className)}>
      <div className={classnames(style.fill, fillClassName)} style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;
