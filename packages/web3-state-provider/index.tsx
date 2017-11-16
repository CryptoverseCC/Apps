import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionCreatorFactory, isType } from 'typescript-fsa';
import { Action } from 'redux';
import * as isEqual from 'lodash/isEqual';

import { web3Enabled } from './selector';
import { observeInjectedWeb3 } from './duck';

interface IWeb3State {
  enabled: boolean;
  reason?: string;
}

interface IProps {
  synchronizeState(): any;
  render(web3State: IWeb3State): any;
  web3State: IWeb3State;
}

class Web3StateProviderComponent extends Component<IProps> {
  componentDidMount() {
    this.props.synchronizeState();
  }

  render() {
    return this.props.render(this.props.web3State);
  }
}

export default connect(
  (state) => ({
    web3State: web3Enabled(state, { network: 'rinkeby' }),
  }),
  (dispatch) => ({
    synchronizeState() {
      dispatch(observeInjectedWeb3());
    }}
  ),
)(Web3StateProviderComponent);
