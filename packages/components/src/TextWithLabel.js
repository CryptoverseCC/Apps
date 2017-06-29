import React from 'react';

import style from './TextWithLabel.scss';

const TextWithLabel = ({ label, text }) => (
  <div className={style.this}>
    <p className={style.label}>{label}</p>
    <p className={style.text}>{text}</p>
  </div>
);

export default TextWithLabel;
