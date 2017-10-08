import React from 'react';
import classnames from 'classnames/bind';

import { ILink } from '../types';

import * as style from './link.scss';

const cx = classnames.bind(style);

interface ILinkProps {
  link: ILink;
  className?: string;
  lines?: number;
  style?: string | {[key: string]: number | string};
}

const stopPropagation = (e) => e.stopPropagation();

const Link = ({ className, link, lines = 2, style: externalStyle }: ILinkProps) => {
  if (!(lines === 2 || lines === 8)) {
    throw new Error('Only 2 and 8 lines links are available');
  }

  return (
    <div className={classnames(style.self, className)} style={externalStyle}>
      <div className={style.title}>{link.title}</div>
      <div className={cx('summary', { lines2: lines === 2, lines8: lines === 8 })}>{link.summary}</div>
      <a
        className={style.link}
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
