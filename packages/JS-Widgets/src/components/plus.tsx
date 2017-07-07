import { h } from 'preact';
import * as classnames from 'classnames/bind';

import * as style from './plus.scss';

const cx = classnames.bind(style);

interface IPlusProps {
  reverseOnHover?: boolean;
}

const Plus = ({ reverseOnHover }: IPlusProps) => {
  return <i class={cx(['self', { reverseOnHover }])} />;
};

export default Plus;
