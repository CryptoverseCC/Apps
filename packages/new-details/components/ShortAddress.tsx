import React from 'react';

export const ShortAddress: React.SFC<{ address: string }> = ({ address }) =>
  address.slice(0, 5) + '...' + address.slice(37);
