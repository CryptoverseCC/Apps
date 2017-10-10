import React from 'react';
import * as styles from './pill.scss';
import classnames from 'classnames';

const Pill = ({ className, ...props }) => (
  <span className={classnames(styles.Pill, className)} {...props} />
);

export default Pill;
