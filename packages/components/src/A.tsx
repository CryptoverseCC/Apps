import React from 'react';
import * as styles from './a.scss';
import classnames from 'classnames';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string;
  bold?: boolean;
};

const A = ({ className, bold, ...props }: Props = { bold: false }) => (
  <a className={classnames(styles.self, className, { [styles.bold]: bold })} {...props} />
);

export default A;
