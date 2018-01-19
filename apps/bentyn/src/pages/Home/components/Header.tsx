import React from 'react';
import qs from 'qs';
import classnames from 'classnames';

import { IWidgetState } from '@linkexchange/ducks/widget';
import Button from '@linkexchange/components/src/NewButton';

import IfOwner from './IfOwner';

import yt from '../../../../images/yt.png';
import medium from '../../../../images/medium.png';
import twitter from '../../../../images/twitter.png';

import * as style from './header.scss';

interface IProps {
  widgetSettings: IWidgetState;
  blocks: {
    startBlock: number;
    endBlock: number;
  };
}

const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://app.linkexchange.io' : window.location.origin;
const openDashboard = (props: IProps) => {
  window.open(`${BASE_URL}/video/dashboard?${qs.stringify({ ...props.blocks, ...props.widgetSettings })}`, '_blank');
};

const Header = (props: IProps) => (
  <div className={style.self}>
    <div className={style.about}>
      <div className={style.token}>
        SB
        <div className={style.inner}>BEN</div>
      </div>
      <div className={style.bio}>
        <p className={style.name}>Szczepan Bentyn</p>
        <p className={style.description}>Talking mostly about cryptocurrencies.</p>
      </div>
      <a
        href="https://web.telegram.org/#/im?p=g176260758"
        target="_blank"
        rel="nofollow"
        className={style.contactMeLink}
      >
        <Button color="secondary" className={classnames(style.contactMe, style.contactMeMobile)}>
          CONTACT ME
        </Button>
      </a>
    </div>
    <div className={style.media}>
      <div className={style.item}>
        <p className={style.number}>8.7k</p>
        <a href="https://www.youtube.com/user/szanow">
          <div className={style.logo}>
            <img src={yt} />
            Youtube
          </div>
        </a>
      </div>
      <div className={style.item}>
        <p className={style.number}>1.8k</p>
        <a href="https://twitter.com/Bentyn">
          <div className={style.logo}>
            <img src={twitter} />
            Twitter
          </div>
        </a>
      </div>
      <div className={style.item}>
        <p className={style.number}>62</p>
        <a href="https://medium.com/@Bentyn">
          <div className={style.logo}>
            <img src={medium} />
            Medium
          </div>
        </a>
      </div>
    </div>
    <IfOwner>
      <Button onClick={() => openDashboard(props)} color="primary" className={style.goToDashboard}>
        Go to dashboard
      </Button>
    </IfOwner>
    <a href="https://web.telegram.org/#/im?p=g176260758" target="_blank" rel="nofollow" className={style.contactMeLink}>
      <Button color="secondary" className={style.contactMe}>
        CONTACT ME
      </Button>
    </a>
  </div>
);

export default Header;
