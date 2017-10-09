import React from 'react';

import * as style from './pill.scss';

const Pill = (props) => {
  if (!props.children) {
    return null;
  }

  return (
    <span className={style.self}>{props.children}</span>
  );
};

export default Pill;
