import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { SmallBlackBoldText } from './Text';

const getColor = (expiresIn) => {
  if (expiresIn < moment.duration({ days: 3 })) {
    return '#fb0035';
  }
  if (expiresIn < moment.duration({ weeks: 1 })) {
    return '#ebeb00';
  }

  return '#09d57c';
};

const SmallRedText = SmallBlackBoldText.extend`
  color: #fb0035;
`;

const Expires = ({ in: expiresIn }: { in: number }) => {
  if (expiresIn < 0) {
    return <SmallRedText>Expired!</SmallRedText>;
  }

  return (
    <SmallBlackBoldText>
      Expires in <span style={{ color: getColor(expiresIn) }}>{moment.duration(expiresIn).humanize()}</span>
    </SmallBlackBoldText>
  );
};
export default Expires;
