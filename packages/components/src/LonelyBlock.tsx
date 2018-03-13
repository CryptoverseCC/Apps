import React from 'react';
import classnames from 'classnames';

import * as style from './lonelyBlock.scss';

type TProps = React.HtmlHTMLAttributes<HTMLDivElement> & { blockClass?: string; shadowClass?: string };

const LonelyBlock = ({ className, blockClass, shadowClass, ...restProps }: TProps) => (
  <div className={classnames(style.LonelyBlock, className)} {...restProps}>
    <div className={classnames(style.Block, blockClass)} />
    <div className={classnames(style.Shadow, shadowClass)} />
  </div>
);

export default LonelyBlock;
