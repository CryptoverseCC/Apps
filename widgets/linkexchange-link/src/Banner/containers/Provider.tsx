import React, { Children } from 'react';
import { Provider as MobxProvider } from 'mobx-react';

import RootToast from '@linkexchange/toast';
import web3, { getInfura, Web3Provider, TNetwork } from '@linkexchange/utils/web3';
import Web3Store from '@linkexchange/web3-store';
import Erc20 from '@linkexchange/web3-store/erc20';
import Web3 from 'web3';
import LinksStore from '@linkexchange/links-store';
import { IWidgetSettings } from '@linkexchange/types/widget';

export default class Provider extends React.Component<{ widgetSettings: IWidgetSettings }> {
  web3Store: Web3Store;
  infuraWeb3: Web3;
  linksStore: LinksStore;

  constructor(props) {
    super(props);
    const [network] = this.props.widgetSettings.asset.split(':');
    this.infuraWeb3 = getInfura(network as TNetwork);
    this.web3Store = new Web3Store(web3, Erc20, this.props.widgetSettings);
    this.linksStore = new LinksStore(this.props.widgetSettings);
  }

  componentWillUnmount() {
    this.web3Store.stopUpdating();
  }

  render() {
    return (
      <MobxProvider
        web3Store={this.web3Store}
        widgetSettingsStore={this.props.widgetSettings}
        formValidationsStore={{ 'add-link': {} }}
        links={this.linksStore}
      >
        <>
          {this.props.children}
          <RootToast />
        </>
      </MobxProvider>
    );
  }
}
