import React from 'react';
import classnames from 'classnames/bind';

import * as style from './steps.scss';

const cx = classnames.bind(style);

const Steps = ({ activeStep }) => (
  <ul className={style.self}>
    <li className={cx('item', { active: activeStep === 'form' })}>
      Send the request
    </li>
    <li className={cx('item', { active: activeStep === 'congratulations' })}>
      Wait for approval
    </li>
  </ul>
);

export default Steps;
