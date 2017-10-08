import React from 'react';
import * as classnames from 'classnames';

import * as style from './loader.scss';

interface ILoaderProps {
  class?: string;
}

const Loader = ({ className}: ILoaderProps) => {
  return <div className={classnames(style.self, className)} />;
};

export default Loader;
