import React from 'react';

import * as style from './footon.scss';

const Footton: React.SFC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...restProps }) => (
  <div className={style.self} {...restProps}>
    {children}
  </div>
);

export default Footton;
