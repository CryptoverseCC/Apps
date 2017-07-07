import { h, FunctionalComponent } from 'preact';

import * as style from './textWithLabel.scss';

import Label from './label';

interface ITextWithLabelProps {
  label: string;
  text?: string | number;
}

const TextWithLabel: FunctionalComponent<ITextWithLabelProps> = ({ label, text, children }) => {
  return (
    <div class={style.self}>
      <Label>{label}</Label>
      <p class={style.text}>{text || children}</p>
    </div>
  );
};

export default TextWithLabel;
