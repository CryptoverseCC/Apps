import React from 'react';

import * as style from './howToBuy.scss';

import yt from '../../../../images/yt.png';

const openYT = () => window.open('https://www.youtube.com/watch?v=k7AgLv6QYUM', '_blank');

const HowToBuy = ({ gotBens }) => (
  <div className={style.self}>
    <div className={style.left}>
      <div className={style.header}>
        How to purchase BEN?
        <div className={style.close} onClick={gotBens}>I HAVE BENs</div>
      </div>
      <iframe
        className={style.video}
        src="https://www.youtube.com/embed/k7AgLv6QYUM"
        frameBorder="0"
      />
      <div className={style.watchOnYt} onClick={openYT}>
        <img src={yt} className={style.yt} /> WATCH ON YOUTUBE
      </div>
    </div>
    <div className={style.right}>
      <div className={style.section}>
        Get some ETHER
        <div className={style.description}>
          You need ETHER to exchange it for my currency.
          <a className={style.time} href="https://youtu.be/k7AgLv6QYUM?t=1m30s" target="_blank">
            Watch details at 1:30
          </a>
        </div>
      </div>
      <div className={style.section}>
        Go to EtherDelta
        <div className={style.description}>
          Currently, Etherdelta is the only exchange.
          <a className={style.time} href="https://youtu.be/k7AgLv6QYUM?t=2m30s" target="_blank">
            Watch details at 2:30
          </a>
        </div>
      </div>
      <div className={style.section}>
        Buy BEN
        <div className={style.description}>
          Here, you can make a bid and buy BENs.
          <a className={style.time} href="https://youtu.be/k7AgLv6QYUM?t=5m30s" target="_blank">
            Watch details at 5:30
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default HowToBuy;
