import { h } from 'preact';
import * as classnames from 'classnames/bind';

import { ILink } from '../types';

import * as style from './link.scss';

const cx = classnames.bind(style);

interface ILinkProps {
  link: ILink;
  lines?: number;
  clickable?: boolean;
}

const Link = ({ link, lines = 2, clickable = false }: ILinkProps) => {
  if (!(lines === 2 || lines === 8)) {
    throw new Error('Only 2 and 8 lines links are available');
  }

  const openTargetUrl = () => clickable && window.open(link.target, '_blank');

  return (
    <div class={cx('self', { clickable })} onClick={openTargetUrl}>
      <div class={style.title}>{link.title}</div>
      <div class={cx('summary', { lines2: lines === 2, lines8: lines === 8 })}>{link.summary}</div>
      <a class={style.link} target="_blank" href={link.target}>{link.target}</a>
    </div>
  );
};

export default Link;
