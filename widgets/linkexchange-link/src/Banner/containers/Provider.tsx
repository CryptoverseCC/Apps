import React from 'react';
import { Provider as MobxProvider } from 'mobx-react';

import RootToast from '@linkexchange/toast';
import web3 from '@linkexchange/utils/web3';
import Web3Store from '@linkexchange/web3-store';
import PropTypes from 'prop-types';

import Erc20 from '@linkexchange/web3-store/erc20';
import LinksStore from '@linkexchange/links-store';
import { IWidgetSettings } from '@linkexchange/types/widget';

export default class Provider extends React.Component<{ widgetSettings: IWidgetSettings }> {
  static contextTypes = { root: PropTypes.object };

  web3Store: Web3Store;
  linksStore: LinksStore;

  constructor(props) {
    super(props);
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
        formValidationsStore={this.context.root.validations}
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
