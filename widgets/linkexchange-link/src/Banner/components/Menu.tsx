import React, { Component } from 'react';
import Icon from '@linkexchange/components/src/Icon';

import * as style from './menu.scss';

const Menu = ({ onClick }) => (
  <div className={style.self} onClick={onClick}>
    See more <Icon className={style.icon} name="external-link" />
  </div>
);

export default Menu;