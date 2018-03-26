import React from 'react';
import classnames from 'classnames/bind';
import { FormattedMessage } from 'react-intl';

import LonelyBlock from '@linkexchange/components/src/LonelyBlock';

import * as style from './noLinks.scss';
const cx = classnames.bind(style);

const NoLinks = ({ className, widgetSize }) => (
  <div className={cx(style.self, className, { [widgetSize]: true })}>
    <LonelyBlock className={style.LonelyBlock} blockClass={style.Block} shadowClass={style.Shadow} />
    <span className={style.message}>
      <FormattedMessage id="banner.noLinks" defaultMessage="No links yet!" />
    </span>
  </div>
);

export default NoLinks;
