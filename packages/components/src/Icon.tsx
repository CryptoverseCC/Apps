import React from 'react';
import classnames from 'classnames';
import 'open-iconic/font/css/open-iconic.min.css';

import * as style from './icon.scss';

interface IIconProps {
  name: string;
  className?: string;
}

const Icon = ({ name, className, ...restProps }: IIconProps) => (
  <span className={classnames(style.self, className, 'oi')} data-glyph={name} aria-hidden="true" {...restProps} />
);

export default Icon;
