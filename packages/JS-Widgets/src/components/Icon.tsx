import { h } from 'preact';
import * as classnames from 'classnames';
import 'open-iconic/font/css/open-iconic.scss';

import * as style from './icon.scss';

interface IIconProps {
  name: string;
  class?: string;
}

const Icon = ({ name, class: className, ...restProps }: IIconProps & JSX.HTMLAttributes) => (
  <span
    class={classnames(className, 'oi', style.self)}
    data-glyph={name}
    aria-hidden="true"
    {...restProps}
  />
);

export default Icon;
