import React, { Component } from 'react';
import { WIDGET_NETWORKS } from '@userfeeds/apps-components/src/Form/Asset';

interface ITokenNameProps {
  asset: string;
}

class TokenName extends Component<ITokenNameProps, {}> {

  render() {
    return this._getTokenName();
  }

  _getTokenName() {
    const [network, token] = this.props.asset.split(':');
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
}

export default TokenName;
