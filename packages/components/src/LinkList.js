import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import style from './LinkList.scss';

const Link = ({ link, onClick }) => {
  return (
    <div className={style.row}>
      <div>
        <div>URL: <a href={link.target}>{link.target}</a></div>
        <div>{link.summary}</div>
      </div>
      {/*<div className={style.button}>
        <RaisedButton
          onClick={onClick.bind(null, ad)}
        >
          Add to whitelist
        </RaisedButton>
      </div>*/}
    </div>
  );
};

const LinkList = ({ links = [], onItemClick = () => {} }) => {
  return (  
    <div className={style.this}>
      {links.map((ad) => (<Link key={ad.id} ad={ad} onClick={onItemClick} />))}
    </div>
  );
};

export default LinkList;
