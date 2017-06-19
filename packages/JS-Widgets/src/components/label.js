import { h } from 'preact';

import style from './label.scss';

const Label = ({ children }) => {
  return <p class={style.this}>{children}</p>;
};

export default Label;
