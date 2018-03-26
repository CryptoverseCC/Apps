import React from 'react';
import classnames from 'classnames/bind';

import { IBaseLink } from '@linkexchange/types/link';

import * as style from './link.scss';

const openUrl = (url: string) => {
  const linkWindow = window.open(url, '_blank');
  if (linkWindow && linkWindow.opener) {
    linkWindow.opener = null;
  }
};

interface ILinkProps {
  link: IBaseLink;
  className?: string;
}

const Link = ({ className, link }: ILinkProps) => {
  return (
    <div className={classnames(style.self, className)} onClick={() => openUrl(link.target)}>
      <div className={style.title}>{link.title}</div>
      <div className={style.summary}>{link.summary}</div>
    </div>
  );
};

export default Link;
