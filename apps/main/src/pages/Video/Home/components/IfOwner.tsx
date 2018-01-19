import React, { Component } from 'react';
import Web3 from 'web3';
import { connect } from 'react-redux';
import flowRight from 'lodash/flowRight';
import { returntypeof } from 'react-redux-typescript';

import { IWidgetState } from '@linkexchange/ducks/widget';
import { withInjectedWeb3AndWeb3State, IWeb3State } from '@linkexchange/web3-state-provider';

const mapStateToProps = ({ widget }: { widget: IWidgetState }) => ({
  asset: widget.asset,
  recipientAddress: widget.recipientAddress,
 });

const State2Props = returntypeof(mapStateToProps);
type TProps = typeof State2Props & {
  web3: Web3;
  web3State: IWeb3State;
};

interface IState {
  enabled: boolean;
}

class IfOwner extends Component<TProps, IState> {
  state = {
    enabled: false,
  };

  constructor(props: TProps) {
    super(props);
    if (props.web3State.enabled) {
      this._getAddress();
    }
  }

  componentWillReceiveProps(nextProps: TProps) {
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
  }
}

export default flowRight(
  connect(mapStateToProps),
  withInjectedWeb3AndWeb3State,
)(IfOwner);
