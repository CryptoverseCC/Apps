import React from 'react';
import { self } from './lightText.scss';
import classnames from 'classnames';

const LightText = (props) => <span {...props} className={classnames(props.className, self)} />;

export default LightText;
