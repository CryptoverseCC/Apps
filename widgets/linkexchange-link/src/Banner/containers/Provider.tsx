import React, { Children } from 'react';
import { Provider as MobxProvider } from 'mobx-react';

import RootToast from '@linkexchange/toast';
import web3, { getInfura, Web3Provider, TNetwork } from '@linkexchange/utils/web3';
import { WidgetSettingsProvider, WidgetSettings } from '@linkexchange/widget-settings';
import Web3Store from '@linkexchange/web3-store';
import Erc20 from '@linkexchange/web3-store/erc20';
import Web3 from 'web3';

export default class Provider extends React.Component<{ widgetSettings: WidgetSettings }> {
  web3Store: Web3Store;
  infuraWeb3: Web3;
  constructor(props) {
    super(props);
    const [network] = this.props.widgetSettings.asset.split(':');
    this.infuraWeb3 = getInfura((network as TNetwork));
    this.web3Store = new Web3Store(web3, Erc20, { asset: this.props.widgetSettings.asset });
  }

  componentWillUnmount() {
    this.web3Store.stopUpdating()
  }

  render() {
    return (
      <MobxProvider web3Store={this.web3Store}>
        <WidgetSettingsProvider widgetSettings={this.props.widgetSettings}>
          <Web3Provider injectedWeb3={web3} infuraWeb3={this.infuraWeb3}>
            <>
              {this.props.children}
              <RootToast />
            </>
          </Web3Provider>
        </WidgetSettingsProvider>
      </MobxProvider>
    );
  }
}
