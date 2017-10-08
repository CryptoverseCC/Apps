import React from 'react';
import classnames from 'classnames';
import 'open-iconic/font/css/open-iconic.min.css';

import * as style from './icon.scss';

type TIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  name: string;
}

const Icon = ({ name, className, ...restProps }: TIconProps) => (
  <span className={classnames(style.self, className, 'oi')} data-glyph={name} aria-hidden="true" {...restProps} />
);

export default Icon;
