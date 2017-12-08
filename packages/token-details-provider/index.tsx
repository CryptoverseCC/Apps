import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { returntypeof } from 'react-redux-typescript';

import core from '@userfeeds/core/src';
import wait from '@linkexchange/utils/wait';

const {
  erc20ContractDecimals,
  erc20ContractBalance,
  erc20ContractSymbol,
  erc20ContractName,
} = core.ethereum.erc20;

interface IProps {
  web3: any;
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

const loadTokenDetails = async (web3, asset, loadBalance, update) => {
  const [network, token] = asset.split(':');
  if (!token) {
    return update({ decimals: '18', symbol: 'ETH', name: 'ETH' });
  }

  while (!(
    web3.currentProvider !== null
    && await web3.eth.net.isListening()
    && await core.utils.getCurrentNetworkName(web3) === network)) {
    await wait(1000);
  }

  while (true) {
    const [decimals, symbol, name, balance] = await Promise.all([
      erc20ContractDecimals(web3, token),
      erc20ContractSymbol(web3, token),
      erc20ContractName(web3, token),
      loadBalance
        ? erc20ContractBalance(web3, token)
        : Promise.resolve(null),
    ]);

    const balanceWithDecimalPoint = balance !== null ? balance / Math.pow(10, decimals) : balance;

    update({
      decimals,
      symbol,
      name,
      balanceWithDecimalPoint,
    });

    await wait(1000);
  }
};

export default class TokenDetailsProvider extends Component<IProps, IState> {
  state = {
    loaded: false,
  };

  componentDidMount() {
    loadTokenDetails(this.props.web3, this.props.asset, this.props.loadBalance, (tokenDetails) => {
      this.setState({ loaded: true, ...tokenDetails });
    });
  }

  render() {
    return this.state.loaded && this.props.render(this.state);
  }
}

export const withTokenDetails = (Cmp) => {
  return class extends Component {
    static displayName = `withTokenDetails(${Cmp.displayName || Cmp.name})`;

    state = {
      loaded: false,
    };

    componentDidMount() {
      loadTokenDetails(this.props.web3, this.props.asset, this.props.loadBalance, (tokenDetails) => {
        this.setState({ loaded: true, ...tokenDetails });
      });
    }

    render() {
      return this.state.loaded ? <Cmp tokenDetails={this.state} {...this.props} /> : null;
    }
  };
};
