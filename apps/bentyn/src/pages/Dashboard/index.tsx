import React, { Component } from 'react';
import flowRight from 'lodash/flowRight';
import { returntypeof } from 'react-redux-typescript';
import { connect } from 'react-redux';
import Web3 from 'web3';
import sigUtil from 'eth-sig-util';

import core from '@userfeeds/core/src';
import { IWidgetState } from '@linkexchange/ducks/widget';
import {
  withInjectedWeb3AndWeb3State,
  IWeb3State,
} from '@linkexchange/web3-state-provider';

const mapStateToProps = ({ widget }: { widget: IWidgetState }) => ({
  asset: widget.asset,
  widgetSettings: widget,
});

const State2Props = returntypeof(mapStateToProps);

type TProps = typeof State2Props & {
  web3State: IWeb3State;
  web3: Web3;
};

interface IState {
  loggedIn: boolean;
  tried: boolean;
}

class Dashboard extends Component<TProps, IState> {
  state = {
    loggedIn: false,
    tried: false,
  };

  componentDidMount() {
    if (this.props.web3State.enabled) {
      this._login();
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.web3State.enabled && !this.state.tried) {
      this._login();
    }
  }

  render() {
    if (!this.state.loggedIn) {
      return null;
    }

    return <h4>Dashboard</h4>;
  }

  _login = async () => {
    this.setState({ tried: true });
    const typedData = [
      {
        type: 'string',
        name: 'Message',
        value: `Prove you are the owner`,
      },
      {
        type: 'uint32',
        name: 'Salt',
        value: Math.floor(Math.random() * 1000).toString(),
      },
    ];

    const [address] = await this.props.web3.eth.getAccounts();
    const signature = await core.utils.signTypedData(this.props.web3, typedData, address);
    const recovered: string = sigUtil.recoverTypedSignature({ data: typedData, sig: signature });
    if (recovered.toLowerCase() === this.props.widgetSettings.recipientAddress.toLowerCase()) {
      this.setState({ loggedIn: true });
    }
  }
}

export default flowRight(
  connect(mapStateToProps),
  withInjectedWeb3AndWeb3State,
)(Dashboard);
