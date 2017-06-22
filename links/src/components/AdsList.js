import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import style from './AdsList.scss';

const Ad = ({ ad, onClick }) => {
  return (
    <div className={style.row}>
      <div>
        <div>URL: <a href={ad.target}>{ad.target}</a></div>
        <div>{ad.summary}</div>
      </div>
      <div className={style.button}>
        <RaisedButton onClick={onClick.bind(null, ad)}>Add to whitelist</RaisedButton>
      </div>
    </div>
  );
};

const AdsList = ({ ads = [], onItemClick = () => {} }) => {
  return (
    <div className={style.this}>
      {ads.map((ad) => (<Ad key={ad.id} ad={ad} onClick={onItemClick} />))}
    </div>
  );
};

export default AdsList;
