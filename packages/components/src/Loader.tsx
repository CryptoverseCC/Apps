import React from 'react';
import classnames from 'classnames';

import * as style from './loader.scss';

interface ILoaderProps {
  className?: string;
}

const Loader = ({ className}: ILoaderProps) => {
  return <div className={classnames(style.self, className)} />;
};

export default Loader;
