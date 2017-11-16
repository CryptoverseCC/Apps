import React, { Component } from 'react';

import { WIDGET_NETWORKS } from './Form/Asset';

function _getTokenName(asset: string): string {
  const [network, token] = asset.split(':');
  if (typeof token === 'undefined') {
    return 'Ether';
  }
  const tokens = WIDGET_NETWORKS[WIDGET_NETWORKS.findIndex((e) => e.value.toLowerCase() === network)].tokens;
  const index = tokens.findIndex((e) => e.value.toLowerCase() === token);
  if (index >= 0) {
    return tokens[index].label;
  } else {
    return `ERC20 (${token})`;
  }
}

const TokenName = ({asset}) => {
  return _getTokenName(asset);
};

export default TokenName;
