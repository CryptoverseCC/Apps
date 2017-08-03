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

const Link = ({ link, lines = 3, clickable = false }: ILinkProps) => {
  if (!(lines === 3 || lines === 8)) {
    throw new Error('Only 3 and 8 lines links are available');
  }

  const openTargetUrl = () => clickable && window.open(link.target, '_blank');

  return (
    <div class={cx('self', { clickable })} onClick={openTargetUrl}>
      <div class={style.title}>{link.title}</div>
      <div class={cx('summary', { lines3: lines === 3, lines8: lines === 8 })}>{link.summary}</div>
      <a class={style.link} target="_blank" href={link.target}>{link.target}</a>
    </div>
  );
};

export default Link;
