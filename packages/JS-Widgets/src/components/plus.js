import { h } from 'preact';
import classnames from 'classnames/bind';

import style from './plus.scss';

const cx = classnames.bind(style);

const Plus = ({ reverseOnHover }) => {
  return <i class={cx(['this', { reverseOnHover }])} />;
};

export default Plus;
