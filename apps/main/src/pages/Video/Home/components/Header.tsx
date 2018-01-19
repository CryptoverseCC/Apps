import React from 'react';
import classnames from 'classnames';
import { Link, match, withRouter } from 'react-router-dom';

import { IWidgetState } from '@linkexchange/ducks/widget';
import { withInfuraAndTokenDetails, ITokenDetails } from '@linkexchange/token-details-provider';
import Button from '@linkexchange/components/src/NewButton';

import IfOwner from './IfOwner';

import yt from '../../../../../images/yt.png';
import medium from '../../../../../images/medium.png';
import twitter from '../../../../../images/twitter.png';

import * as style from './header.scss';

interface IProps {
  match: match<any>;
  widgetSettings: IWidgetState;
  tokenDetails: ITokenDetails;
  blocks: {
    startBlock: number;
    endBlock: number;
  };
}

const Header = (props: IProps) => (
  <div className={style.self}>
    <div className={style.about}>
      <div className={style.token}>{props.tokenDetails.symbol}</div>
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

export default withRouter(withInfuraAndTokenDetails(Header));
