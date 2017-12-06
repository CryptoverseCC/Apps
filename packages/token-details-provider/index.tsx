import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { returntypeof } from 'react-redux-typescript';

import core from '@userfeeds/core/src';
import web3 from '@linkexchange/utils/web3';
import wait from '@linkexchange/utils/wait';

const {
  erc20ContractDecimals,
  erc20ContractBalance,
  erc20ContractSymbol,
  erc20ContractName,
} = core.ethereum.erc20;

interface IProps {
  web3?: any;
  asset: string;
  loadBalance?: boolean;
  render(tokenDetails: any): any;
}

interface IState {
  loaded: boolean;
  decimals?: string;
  symbol?: string;
  name?: string;
  balanceWithDecimalPoint?: string | null;
}

export default class TokenDetailsProvider extends Component<IProps, IState> {
  state = {
    loaded: false,
  };

  componentDidMount() {
    this._loadTokenDetails(this.props.web3 || web3, this.props.asset);
  }

  render() {
    return this.state.loaded && this.props.render(this.state);
  }

  _loadTokenDetails = async (web3, asset) => {
    const [network, token] = asset.split(':');
    if (!token) {
      return;
    }

    while (!(web3.isConnected() && await core.utils.getCurrentNetworkName(web3) === network)) {
      await wait(1000);
    }

    const [decimals, symbol, name, balance] = await Promise.all([
      erc20ContractDecimals(web3, token),
      erc20ContractSymbol(web3, token),
      erc20ContractName(web3, token),
      this.props.loadBalance
        ? erc20ContractBalance(web3, token)
        : Promise.resolve(null),
    ]);

    const balanceWithDecimalPoint = balance !== null ? balance.shift(-decimals).toString() : balance;

    this.setState({
      loaded: true,
      decimals: decimals.toString(),
      symbol,
      name,
      balanceWithDecimalPoint,
    });
  }
}
