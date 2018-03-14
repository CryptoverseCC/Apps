import React from 'react';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import { Link, match, withRouter } from 'react-router-dom';

import Web3Store from '@linkexchange/web3-store';
import Button from '@linkexchange/components/src/NewButton';
import { WidgetSettings } from '@linkexchange/widget-settings';

import IfOwner from './IfOwner';

import yt from '../../../../../images/yt.png';
import medium from '../../../../../images/medium.png';
import twitter from '../../../../../images/twitter.png';

import * as style from './header.scss';

interface IProps {
  match: match<any>;
  widgetSettings: WidgetSettings;
  web3Store: Web3Store;
  blocks: {
    startBlock: number;
    endBlock: number;
  };
}

const Header = (props: IProps) => (
  <div className={style.self}>
    <div className={style.about}>
      <div className={style.token}>{props.web3Store.symbol}</div>
      <div className={style.bio}>
        <p className={style.name}>{props.widgetSettings.title}</p>
        <p className={style.description}>{props.widgetSettings.description}</p>
      </div>
      <Button color="secondary" className={classnames(style.contactMe, style.contactMeMobile)}>
        CONTACT ME
      </Button>
    </div>
    <IfOwner>
      <Link to={`${props.match.url}/dashboard`} className={style.goToDashboard}>
        <Button color="primary">Go to dashboard</Button>
      </Link>
    </IfOwner>
    <Button color="secondary" className={style.contactMe}>
      CONTACT ME
    </Button>
  </div>
);

// ToDo fix when withRouter will be have valid signature
const wrappedHeader: React.ComponentClass<any> = withRouter(inject('web3Store')(observer(Header)));
export default wrappedHeader;
