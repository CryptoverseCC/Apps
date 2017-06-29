import React from 'react';

import style from './Link.scss';

const Link = ({ link }) => (
  <div className={style.this}>
    <div className={style.title}>{link.title}</div>
    <div className={style.summary}>{link.summary}</div>
    <div className={`row ${style.footer}`}>
      <a className={style.link} target="_blank" href={link.target}>{link.target}</a>
      <div className={style.probability}>Probability: {link.probability}%</div>
    </div>
  </div>
);

export default Link;
