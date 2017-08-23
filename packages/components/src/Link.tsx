import { h } from 'preact';
import * as classnames from 'classnames/bind';

import { ILink } from '../types';

import * as style from './link.scss';

const cx = classnames.bind(style);

interface ILinkProps {
  link: ILink;
  class?: string;
  lines?: number;
  style?: string | {[key: string]: number | string};
}

const stopPropagation = (e) => e.stopPropagation();

const Link = ({ class: className, link, lines = 2, style: externalStyle }: ILinkProps) => {
  if (!(lines === 2 || lines === 8)) {
    throw new Error('Only 2 and 8 lines links are available');
  }

  return (
    <div class={classnames(style.self, className)} style={externalStyle}>
      <div class={style.title}>{link.title}</div>
      <div class={cx('summary', { lines2: lines === 2, lines8: lines === 8 })}>{link.summary}</div>
      <a
        class={style.link}
        target="_blank"
        href={link.target}
        onClick={stopPropagation}
      >
        {link.target}
      </a>
    </div>
  );
};

export default Link;
