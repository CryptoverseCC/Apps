import React from 'react';
import classnames from 'classnames';

import * as style from './progressBar.scss';

interface IProps {
  progress: number;
  className?: string;
}

const ProgressBar = ({ progress, className }: IProps) => {
  return (
    <div className={classnames(style.self, className)}>
      <div className={style.fill} style={{ width: `${progress}px` }}/>
    </div>
  );
};

export default ProgressBar;
