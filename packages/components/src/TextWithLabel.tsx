import React from 'react';
import * as classnames from 'classnames';

import * as style from './textWithLabel.scss';

import Label from './Label';

interface ITextWithLabelProps {
  label: string |JSX.Element;
  text?: string | number;
  class?: string;
}

const TextWithLabel = ({ label, text, class: className, children }: ITextWithLabelProps) => {
  return (
    <div class={classnames(style.self, className)}>
      <Label>{label}</Label>
      <p class={style.text}>{text || children}</p>
    </div>
  );
};

export default TextWithLabel;
