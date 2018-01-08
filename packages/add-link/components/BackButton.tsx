import React from 'react';

import Icon from '@linkexchange/components/src/Icon';

import * as style from './backButton.scss';

const BackButton = (props) => (
  <button className={style.self} {...props}>
    <Icon name="arrow-left"/> Widget details
  </button>
);

export default BackButton;
