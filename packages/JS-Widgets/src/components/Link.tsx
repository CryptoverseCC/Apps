import { h } from 'preact';
import * as classnames from 'classnames/bind';

import { ILink } from '../types';

import * as style from './link.scss';

const cx = classnames.bind(style);

interface ILinkProps {
  link: ILink;
  clickable?: boolean;
}

const Link = ({ link, clickable = false }: ILinkProps) => {
  const openTargetUrl = () => clickable && window.open(link.target, '_blank');

  return (
    <div class={cx('self', { clickable })} onClick={openTargetUrl}>
      <div class={style.title}>{link.title}</div>
      <div class={style.summary}>{link.summary}</div>
      <a class={style.link} target="_blank" href={link.target}>{link.target}</a>
    </div>
  );
};

export default Link;
