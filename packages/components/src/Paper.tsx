import React from 'react';
import classnames from 'classnames';

import * as style from './paper.scss';

const Paper = ({ className, ...restProps }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...restProps} className={classnames(className, style.self)} />
);

export default Paper;
