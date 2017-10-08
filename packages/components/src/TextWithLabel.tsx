import React from 'react';
import classnames from 'classnames';

import * as style from './textWithLabel.scss';

import Label from './Label';

interface ITextWithLabelProps {
  label: string | JSX.Element;
  text?: string | number;
  className?: string;
  children?: JSX.Element | string;
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
