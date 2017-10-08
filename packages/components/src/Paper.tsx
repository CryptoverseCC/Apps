import React from 'react';
import * as classnames from 'classnames';

import * as style from './paper.scss';

const Paper = ({ class: className, ...restProps }) => (
  <div {...restProps} class={classnames(className, style.self)} />
);

export default Paper;
