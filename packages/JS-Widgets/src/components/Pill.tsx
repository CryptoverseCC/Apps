import { h } from 'preact';

import * as style from './pill.scss';

const Pill = (props) => {
  if (!props.children) {
    return null;
  }

  return (
    <span class={style.self}>{props.children}</span>
  );
};

export default Pill;