import React from 'react';

import Icon from '@linkexchange/components/src/Icon';

import { ILink } from '@userfeeds/types/link';

import * as style from './link.scss';

interface ILinkProps {
  tokenSymbol?: string;
  link: ILink;
}

const Link = ({ link, tokenSymbol}: ILinkProps) => (
  <div className={style.self}>
    <div className={style.probability}>
      <Icon name="eye"/> {link.probability}%
    </div>
    <div>
      <p className={style.title}>{link.title}: {link.summary}</p>
      <a className={style.target}>{link.target}</a>
    </div>
    <div className={style.token}>
      Sponsored with:
      <div className={style.tokenSymbol}>{tokenSymbol}</div>
    </div>
  </div>
);

export default Link;
