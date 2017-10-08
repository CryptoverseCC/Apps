import React from 'react';
import * as classnames from 'classnames';

import * as style from './loader.scss';

interface ILoaderProps {
  class?: string;
}

const Loader = ({ class: className}: ILoaderProps) => {
  return <div class={classnames(style.self, className)} />;
};

export default Loader;
