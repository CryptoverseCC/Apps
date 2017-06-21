import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import './AdsList.css';

const Ad = ({ ad, onClick }) => {
  return (
    <div className="Ad-container">
      <div>
        <div>URL: <a href={ad.target}>{ad.target}</a></div>
        <div>{ad.summary}</div>
      </div>
      <div className="Ad-button">
        <RaisedButton onClick={onClick.bind(null, ad)}>Add to whitelist</RaisedButton>
      </div>
    </div>
  );
};

const AdsList = ({ ads = [], onItemClick = () => {} }) => {
  return (
    <div>
      {ads.map((ad) => (<Ad key={ad.id} ad={ad} onClick={onItemClick} />))}
    </div>
  );
};

export default AdsList;
