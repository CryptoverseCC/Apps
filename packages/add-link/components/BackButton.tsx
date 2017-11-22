import React from 'react';

import Icon from '@linkexchange/components/src/Icon';

import * as style from './backButton.scss';

const BackButton = (props) => (
  <div className={style.self} {...props}>
    <Icon name="arrow-left"/> Widget details
  </div>
);

export default BackButton;
