import React from 'react';
import classnames from 'classnames';

import * as style from './textWithLabel.scss';

import Label from './Label';

interface ITextWithLabelProps {
  label: string | JSX.Element;
  text?: string | number;
  className?: string;
  children?: string | JSX.Element | Array<(string | JSX.Element)>;
}

const TextWithLabel = ({ label, text, className, children }: ITextWithLabelProps) => {
  return (
    <div className={classnames(style.self, className)}>
      <Label>{label}</Label>
      <div className={style.text}>{text || children}</div>
    </div>
  );
};

export default TextWithLabel;
