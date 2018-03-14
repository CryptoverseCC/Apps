import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Web3Store from '@linkexchange/web3-store';
import { WidgetSettings } from '@linkexchange/widget-settings';

interface IProps {
  web3Store: Web3Store;
  widgetSettingsStore: WidgetSettings;
  recipientAddress: string;
}

interface IState {
  enabled: boolean;
}

@inject('web3Store', 'widgetSettingsStore')
@observer
class IfOwner extends Component<IProps, IState> {
  render() {
    if (!this.props.web3Store.reason && this.props.web3Store.currentAccount === this.props.recipientAddress) {
      return this.props.children;
    }

    return null;
  }
}

export default IfOwner;
