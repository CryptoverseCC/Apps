import React from 'react';

import * as style from './label.scss';

const Label = (props) => {
  if (props && props.children) {
    return <p className={style.self}>{props.children}</p>;
  }

  return <p className={style.self} />;
};

export default Label;
