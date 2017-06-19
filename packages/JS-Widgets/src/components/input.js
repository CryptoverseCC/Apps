import { h } from 'preact';

import style from './input.scss';

const Input = ({ placeholder, ...restProps }) => {
  return (
    <div class={style.this}>
      <input class={style.input} required {...restProps} />
      <span class={style.placeholder}>{placeholder}</span>
      <span class={style.highlight} />
    </div>
  );
};

export default Input;
