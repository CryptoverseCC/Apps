import React from 'react';

import web3 from '@userfeeds/utils/src/web3';

import Button from '@userfeeds/apps-components/src/Button';

import * as style from './linksList.scss';

const noop = () => null;

interface ILinkProps {
  link: any;
  onClick(item: any): void;
}

const Ad = ({ link, onClick }: ILinkProps) => (
  <div className={style.row}>
    <div>
      <div>URL: <a href={link.target}>{link.target}</a></div>
      <div>score: {web3.fromWei(link.score, 'ether')}</div>
      <div>{link.title}</div>
      <div>{link.summary}</div>
    </div>
    <div className={style.button}>
      <Button
        onClick={onClick.bind(null, link)}
        disabled={link.whitelisted}
      >
        Add to whitelist
      </Button>
    </div>
  </div>
);

interface ILinksListProps {
  links: any[];
  onItemClick?: (item: any) => void;
}

const LinksList = ({ links = [], onItemClick = noop }: ILinksListProps) => (
  <div className={style.self}>
    {links.map((ad) => (<Ad link={ad} onClick={onItemClick} />))}
  </div>
);

export default LinksList;
