import React from 'react';
import moment from 'moment';

import { BlackBoldText } from './Text';

const getColor = (expiresIn) => {
  if (expiresIn < moment.duration({ days: 3 })) {
    return '#fb0035';
  }
  if (expiresIn < moment.duration({ weeks: 1 })) {
    return '#ebeb00';
  }

  return '#09d57c';
};

const SmallRedText = BlackBoldText.extend`
  color: #fb0035;
`;

const Expires = ({ in: expiresIn }: { in: number }) => {
  if (isNaN(expiresIn)) {
    return null;
  }

  if (expiresIn < 0) {
    return <SmallRedText style={{ margin: '10px 0' }}>Expired!</SmallRedText>;
  }

  return (
    <BlackBoldText style={{ margin: '10px 0' }}>
      Expires in <span style={{ color: getColor(expiresIn) }}>{moment.duration(expiresIn).humanize()}</span>
    </BlackBoldText>
  );
};
export default Expires;
