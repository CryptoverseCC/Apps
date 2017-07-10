import React from 'react';
// import RaisedButton from 'material-ui/RaisedButton';

import style from './LinkList.scss';

const Link = ({ link, _onClick }) => (
  <div className={style.row}>
    <div>
      <div>URL: <a href={link.target}>{link.target}</a></div>
      <div>{link.summary}</div>
    </div>
  </div>
);

const LinkList = ({ links = [], onItemClick = () => { } }) => (
  <div className={style.this}>
    {links.map((link) => (<Link key={link.id} link={link} onClick={onItemClick} />))}
  </div>
);

export default LinkList;
