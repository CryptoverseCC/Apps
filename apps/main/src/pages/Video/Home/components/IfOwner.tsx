import React from 'react';
import { inject, observer } from 'mobx-react';

import Web3Store from '@linkexchange/web3-store';
import { WidgetSettings } from '@linkexchange/widget-settings';

interface IProps {
  web3Store?: Web3Store;
  widgetSettingsStore?: WidgetSettings;
  children: JSX.Element;
}

const IfOwner = ({ web3Store, widgetSettingsStore, children }: IProps) => {
  if (web3Store!.currentAccount === widgetSettingsStore!.recipientAddress) {
    return children;
  }
  return null;
};

export default inject('web3Store', 'widgetSettingsStore')(observer(IfOwner));
