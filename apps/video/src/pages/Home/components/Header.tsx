import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

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
      <Button color="secondary" className={classnames(style.contactMe, style.contactMeMobile)}>CONTACT ME</Button>
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
