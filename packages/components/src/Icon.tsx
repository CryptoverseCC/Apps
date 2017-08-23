import { h } from 'preact';
import * as classnames from 'classnames';
import 'open-iconic/font/css/open-iconic.min.css';

import * as style from './icon.scss';

interface IIconProps {
  name: string;
  class?: string;
}

const Icon = ({ name, class: className }: IIconProps) => (
  <span class={classnames(style.self, className, 'oi')} data-glyph={name} aria-hidden="true" />
);

export default Icon;
