import { h, FunctionalComponent } from 'preact';
import * as classnames from 'classnames/bind';

import * as style from './buttonSecondary.scss';

const cx = classnames.bind(style);

const buttonSecondary: FunctionalComponent<JSX.HTMLAttributes> = (props) => {
  const { class: className } = props;

  return <button class={cx('self', className)} {...props} />;
};

export default buttonSecondary;
