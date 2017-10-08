import React from 'react';
import * as classnames from 'classnames';

import * as style from './textWithLabel.scss';

import Label from './Label';

interface ITextWithLabelProps {
  label: string |JSX.Element;
  text?: string | number;
  class?: string;
}

const TextWithLabel = ({ label, text, className, children }: ITextWithLabelProps) => {
  return (
    <div className={classnames(style.self, className)}>
      <Label>{label}</Label>
      <p className={style.text}>{text || children}</p>
    </div>
  );
};

export default TextWithLabel;
