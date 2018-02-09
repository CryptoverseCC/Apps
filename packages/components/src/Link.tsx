import React from 'react';
import classnames from 'classnames/bind';

import { IBaseLink } from '@linkexchange/types/link';

import * as style from './link.scss';

interface ILinkProps {
  link: IBaseLink;
  className?: string;
  style?: React.CSSProperties;
}

const stopPropagation = (e) => e.stopPropagation();

const Link = ({ className, link, style: externalStyle }: ILinkProps) => {
  return (
    <div className={classnames(style.self, className)} style={externalStyle}>
      <div className={style.title}>{link.title}</div>
      <div className={style.summary}>{link.summary}</div>
      <a className={style.link} target="_blank" rel="nofollow" href={link.target} onClick={stopPropagation}>
        {link.target}
      </a>
    </div>
  );
};

export default Link;
