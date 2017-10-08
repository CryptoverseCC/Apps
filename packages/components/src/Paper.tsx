import React from 'react';
import * as classnames from 'classnames';

import * as style from './paper.scss';

const Paper = ({ className, ...restProps }) => (
  <div {...restProps} className={classnames(className, style.self)} />
);

export default Paper;
