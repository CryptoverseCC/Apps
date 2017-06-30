import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import style from './AdsList.scss';

const Ad = ({ ad, onClick }) => (
  <div className={style.row}>
    <div>
      <div>URL: <a href={ad.target}>{ad.target}</a></div>
      <div>score: {web3.fromWei(ad.score, 'ether')}</div>
      <div>{ad.title}</div>
      <div>{ad.summary}</div>
    </div>
    <div className={style.button}>
      <RaisedButton
        onClick={onClick.bind(null, ad)}
        disabled={ad.whitelisted}
      >
        Add to whitelist
      </RaisedButton>
    </div>
  </div>
);

const AdsList = ({ ads = [], onItemClick = () => {} }) => (
  <div className={style.this}>
    {ads.map((ad) => (<Ad key={ad.id} ad={ad} onClick={onItemClick} />))}
  </div>
);

export default AdsList;
