import React, { Component } from 'react';
import Web3 from 'web3';

import core from '@userfeeds/core/src';
import wait from '@linkexchange/utils/wait';
import { Omit, Diff } from '@linkexchange/types';

const {
  erc20ContractDecimals,
  erc20ContractBalance,
  erc20ContractSymbol,
  erc20ContractName,
} = core.ethereum.erc20;

interface IProps {
  web3: Web3;
  asset: string;
  loadBalance?: boolean;
  render(tokenDetails: ITokenDetails): any;
}

export interface ITokenDetails {
  decimals: string;
  symbol: string;
  name: string;
  balanceWithDecimalPoint?: string | null;
}

interface IState {
  loaded: boolean;
  tokenDetails?: ITokenDetails;
}

interface IComponentProps {
  tokenDetails: ITokenDetails;
}

export default class TokenDetailsProvider extends Component<IProps, IState> {
  state: IState = {
    loaded: false,
  };

  componentDidMount() {
    loadTokenDetails(this.props.web3, this.props.asset, this.props.loadBalance, (tokenDetails) => {
      this.setState({ loaded: true, tokenDetails });
    });
  }

  render() {
    return this.state.loaded && this.props.render(this.state.tokenDetails!);
  }
}

export const withTokenDetails = <T extends IComponentProps>(Cmp: React.ComponentType<T>) => {
  return class extends Component<Omit<T, keyof IComponentProps> & { loadBalance?: boolean; }, IState> {
    static displayName = `withTokenDetails(${Cmp.displayName || Cmp.name})`;

    state: IState = {
      loaded: false,
    };

    componentDidMount() {
      loadTokenDetails(this.props.web3, this.props.asset, this.props.loadBalance, (tokenDetails) => {
        this.setState({ loaded: true, tokenDetails });
      });
    }

    render() {
      return this.state.loaded ? <Cmp tokenDetails={this.state.tokenDetails!} {...this.props} /> : null;
    }
  };
};

const loadTokenDetails = async (web3, asset, loadBalance, update) => {
  const [network, token] = asset.split(':');
  if (!token && !loadBalance) {
    return update({ decimals: '18', symbol: 'ETH', name: 'ETH' });
  }

  while (!(
    web3.currentProvider !== null
    && await web3.eth.net.isListening()
    && await core.utils.getCurrentNetworkName(web3) === network)) {
    await wait(1000);
  }

  if (!token && loadBalance) {
    while (true) {
      const balance = await core.utils.getBalance(web3);
      const balanceWithDecimalPoint = balance !== null ? balance / Math.pow(10, 18) : balance;

      update({ decimals: '18', symbol: 'ETH', name: 'ETH', balanceWithDecimalPoint }); // ToDo to BN
      await wait(1000);
    }
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

    const balanceWithDecimalPoint = balance !== null ? balance / Math.pow(10, decimals) : balance; // ToDo to BN

    update({
      decimals,
      symbol,
      name,
      balanceWithDecimalPoint,
    });

    await wait(1000);
  }
};
