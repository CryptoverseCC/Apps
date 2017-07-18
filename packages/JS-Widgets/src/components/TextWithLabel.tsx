import { h, FunctionalComponent } from 'preact';
import * as classnames from 'classnames';

import * as style from './textWithLabel.scss';

import Label from './Label';

interface ITextWithLabelProps {
  label: string;
  text?: string | number;
  class?: string;
}

const TextWithLabel: FunctionalComponent<ITextWithLabelProps> = ({ label, text, class: className, children }) => {
  return (
    <div class={classnames(style.self, className)}>
      <Label>{label}</Label>
      <p class={style.text}>{text || children}</p>
    </div>
  );
};

export default TextWithLabel;
