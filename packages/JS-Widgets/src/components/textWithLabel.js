import { h } from 'preact';

import style from './textWithLabel.scss';

import Label from './label';

const TextWithLabel = ({ label, text, children }) => {
  return (
    <div class={style.this}>
      <Label>{label}</Label>
      <p class={style.text}>{text || children}</p>
    </div>
  );
};

export default TextWithLabel;
