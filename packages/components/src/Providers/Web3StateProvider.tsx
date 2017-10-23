import React, { Component } from 'react';

interface IWeb3State {
  enabled: boolean;
  reason?: string;
}

interface IProps {
  synchronizeState(): any;
  render(web3State: IWeb3State): any;
  web3State: IWeb3State;
}

export default class Web3StateProvider extends Component<IProps> {
  componentDidMount() {
    this.props.synchronizeState();
  }

  render() {
    return this.props.render(this.props.web3State);
  }
}
