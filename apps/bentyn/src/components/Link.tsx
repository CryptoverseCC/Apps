import React from 'react';

import { ILink } from '@userfeeds/types/link';

import * as style from './link.scss';

interface ILinkProps {
  link: ILink;
}

const Link = ({ link }: ILinkProps) => (
  <div className={style.self}>
    <p>Probability {link.probability}</p>
  </div>
);

export default Link;
