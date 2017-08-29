import { h } from 'preact';
import * as classnames from 'classnames/bind';

import * as style from './steps.scss';
const cx = classnames.bind(style);

const Steps = ({ activeStep }) => (
  <ul class={style.self}>
    <li class={cx('item', { active: activeStep === 'form' })}>
      Send the request
    </li>
    <li class={cx('item', { active: activeStep === 'congratulations' })}>
      Wait for approval
    </li>
  </ul>
);

export default Steps;
