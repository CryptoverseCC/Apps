import { h } from 'preact';

import * as style from './linkList.scss';

const noop = () => null;

interface ILinkProps {
  link: any;
}

const Link = ({ link }: ILinkProps) => (
  <div class={style.row}>
    <div>
      <div>URL: <a href={link.target}>{link.target}</a></div>
      <div>{link.summary}</div>
    </div>
  </div>
);

interface ILinkListProps {
  links: any[];
  onItemClick?: (item: any) => void;
}

const LinkList = ({ links = []}: ILinkListProps) => (
  <div class={style.self}>
    {links.map((link) => (<Link link={link} />))}
  </div>
);

export default LinkList;