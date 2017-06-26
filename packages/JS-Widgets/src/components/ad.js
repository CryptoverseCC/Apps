import { h } from 'preact';

import style from './ad.scss';

const Ad = ({ ad }) => {
  return (
    <div class={style.this}>
      <div class={style.title}>{ad.title}</div>
      <div class={style.summary}>{ad.summary}</div>
      <div class={`row ${style.footer}`}>
        <a class={style.link} target="_blank" href={ad.target}>{ad.target}</a>
        <div class={style.probability}>Probability: {ad.probability}%</div>
      </div>
    </div>
  );
};

export default Ad;
