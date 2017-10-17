import React from 'react';
import * as styles from './a.scss';
import classnames from 'classnames';

interface IProps {
  className?: string;
  children?: string | JSX.Element;
  bold?: boolean;
  href?: string;
}

const A = ({ className, bold, ...props }: IProps = { bold: false }) => (
  <a className={classnames(styles.self, className, { [styles.bold]: bold })} {...props} />
);

export default A;
