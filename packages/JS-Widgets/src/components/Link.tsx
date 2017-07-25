import { h } from 'preact';

import { ILink } from '../types';

import * as style from './link.scss';

interface ILinkProps {
  link: ILink;
  showProbability: boolean;
}

const Link = ({ link, showProbability = true }: ILinkProps) => {
  const openTargetUrl = () => window.open(link.target, '_blank');

  return (
    <div class={style.self} onClick={openTargetUrl}>
      <div class={style.title}>{link.title}</div>
      <div>{link.summary}</div>
      <div class={`row ${style.footer}`}>
        <a class={style.link} target="_blank" href={link.target}>{link.target}</a>
        {showProbability && <div class={style.probability}>Probability: {link.probability}%</div>}
      </div>
    </div>
  );
};

export default Link;
