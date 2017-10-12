import React from 'react';
import { self } from './boldText.scss';

const BoldText = (props) => <span {...props} className={`${props.className} ${self}`} />;

export default BoldText;
