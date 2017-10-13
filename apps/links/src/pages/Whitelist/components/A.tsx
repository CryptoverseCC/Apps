import React from 'react';
import * as styles from './a.scss';
import classnames from 'classnames';

interface IProps {
  className?: string;
  children?: string | JSX.Element;
  href?: string;
}

const A = ({ className, ...props }: IProps) => (
  <a className={classnames(styles.self, className)} {...props} />
);

export default A;
