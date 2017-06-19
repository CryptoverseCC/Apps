import { h } from 'preact';

import './ad.css';

const Ad = ({ ad }) => {
  return (
    <div class="ad-container">
      <div class="title">{ad.title}</div>
      <div class="summary">{ad.summary}</div>
      <div class="row footer">
        <div class="link">{ad.target}</div>
        <div class="probability">Probability: {ad.probability}%</div>
      </div>
    </div>
  );
};

export default Ad;
