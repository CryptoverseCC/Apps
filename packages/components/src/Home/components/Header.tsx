import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import Button from '@linkexchange/components/src/NewButton';

import IfOwner from './IfOwner';

import yt from '../../../../images/yt.png';
import medium from '../../../../images/medium.png';
import twitter from '../../../../images/twitter.png';

import * as style from './header.scss';

const Header = () => (
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
      <Button color="secondary" className={classnames(style.contactMe, style.contactMeMobile)}>CONTACT ME</Button>
    </div>
    <div className={style.media}>
      <div className={style.item}>
        <p className={style.number}>8.7k</p>
        <a href="https://www.youtube.com/user/szanow">
          <div className={style.logo}>
            <img src={yt}/>
            Youtube
          </div>
        </a>
      </div>
      <div className={style.item}>
        <p className={style.number}>1.8k</p>
        <a href="https://twitter.com/Bentyn">
          <div className={style.logo}>
            <img src={twitter}/>
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
      <Link to="/dashboard" className={style.goToDashboard}>
        <Button color="primary">Go to dashboard</Button>
      </Link>
    </IfOwner>
    <Button color="secondary" className={style.contactMe}>CONTACT ME</Button>
  </div>
);

export default Header;
