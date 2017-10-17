import React from 'react';
import classnames from 'classnames';

import * as style from './loader.scss';

interface ILoaderProps {
  className?: string;
  containerClassName?: string;
  containerStyle?: object;
}

const Loader = ({ className, containerClassName, containerStyle }: ILoaderProps) => {
  return (
    <div className={classnames(style.container, containerClassName)} style={containerStyle}>
      <div className={classnames(style.self, className)} />
    </div>
  );
};

export default Loader;
