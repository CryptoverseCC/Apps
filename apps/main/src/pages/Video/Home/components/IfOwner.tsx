import React, { Component } from 'react';
import Web3 from 'web3';
import flowRight from 'lodash/flowRight';

import { WidgetSettings, withWidgetSettings } from '@linkexchange/widget-settings';
import { withInjectedWeb3AndWeb3State, IWeb3State } from '@linkexchange/web3-state-provider';

interface IProps {
  web3: Web3;
  web3State: IWeb3State;
  widgetSettings: WidgetSettings;
  recipientAddress: string;
}

interface IState {
  enabled: boolean;
}

class IfOwner extends Component<IProps, IState> {
  state = {
    enabled: false,
  };

  constructor(props: IProps) {
    super(props);
    if (props.web3State.enabled) {
      this._getAddress();
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.web3State.enabled) {
      this._getAddress();
    }
  }

  render() {
    if (this.state.enabled) {
      return this.props.children;
    }

    return null;
  }

  _getAddress = async () => {
    const [account] = await this.props.web3.eth.getAccounts();
    this.setState({
      enabled: account === this.props.recipientAddress,
    });
  };
}

// Move to utils and add types
const propsMapper = (mapper: (props) => any) => (Cmp) => (props) => <Cmp {...props} {...mapper(props)} />;

export default flowRight(
  withWidgetSettings,
  propsMapper(({ widgetSettings }: { widgetSettings: WidgetSettings }) => ({
    asset: widgetSettings.asset,
    recipientAddress: widgetSettings.recipientAddress,
  })),
  withInjectedWeb3AndWeb3State,
)(IfOwner);
