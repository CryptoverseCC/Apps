import React from 'react';
import { self } from './boldText.scss';
import classnames from 'classnames';

const BoldText = (props) => <span {...props} className={classnames(props.className, self)} />;

export default BoldText;
