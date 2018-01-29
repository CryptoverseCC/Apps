import React from 'react';

import heartSvg from '@linkexchange/images/heart.svg';

import * as style from './success.scss';

const Success = () => (
  <div className={style.self}>
    <img src={heartSvg} />
    <p>The link was successfully boosted but it can take up to 10 minutes to be processed.</p>
  </div>
);

export default Success;
