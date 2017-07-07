import { h } from 'preact';

import { ILink } from '../types';

import * as style from './link.scss';

interface ILinkProps {
  link: ILink;
}

const Link = ({ link }: ILinkProps) => {
  return (
    <div class={style.self}>
      <div class={style.title}>{link.title}</div>
      <div>{link.summary}</div>
      <div class={`row ${style.footer}`}>
        <a class={style.link} target="_blank" href={link.target}>{link.target}</a>
        <div class={style.probability}>Probability: {link.probability}%</div>
      </div>
    </div>
  );
};

export default Link;
