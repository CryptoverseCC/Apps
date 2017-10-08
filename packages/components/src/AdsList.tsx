import React from 'react';
import Button from './Button';

import * as style from './adsList.scss';

const noop = () => null;

interface IAdProps {
  ad: any;
  onClick(item: any): void;
}

const Ad = ({ ad, onClick }: IAdProps) => (
  <div class={style.row}>
    <div>
      <div>URL: <a href={ad.target}>{ad.target}</a></div>
      <div>score: {web3.fromWei(ad.score, 'ether')}</div>
      <div>{ad.title}</div>
      <div>{ad.summary}</div>
    </div>
    <div class={style.button}>
      <Button
        onClick={onClick.bind(null, ad)}
        disabled={ad.whitelisted}
      >
        Add to whitelist
      </Button>
    </div>
  </div>
);

interface IAdsListProps {
  ads: any[];
  onItemClick?: (item: any) => void;
}

const AdsList = ({ ads = [], onItemClick = noop }: IAdsListProps) => (
  <div class={style.self}>
    {ads.map((ad) => (<Ad ad={ad} onClick={onItemClick} />))}
  </div>
);

export default AdsList;
