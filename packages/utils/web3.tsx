import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';

import { Omit, Diff } from '@linkexchange/types';

const web3 = new Web3();

const setProviderIfAvailable = () => {
  if (typeof window.web3 !== 'undefined') {
    web3.setProvider(window.web3.currentProvider);
  }
};

if (document.readyState === 'complete') {
  setProviderIfAvailable();
} else {
  window.addEventListener('load', setProviderIfAvailable);
}

export default web3;

export type TNetwork = 'ropsten' | 'rinkeby' | 'kovan' | 'ethereum';

const infuraNetworkMapping = new Map<TNetwork, Web3>();

export const getInfura = (network: TNetwork): Web3 => {
  if (infuraNetworkMapping.has(network)) {
    return infuraNetworkMapping.get(network);
  }
  const networkName = network === 'ethereum' ? 'mainnet' : network;
  const web3 = new Web3(new Web3.providers.HttpProvider(`https://${networkName}.infura.io/DjvHIbnUXoxqu4dPRcbB`));
  infuraNetworkMapping.set(network, web3);

  return web3;
};

interface IProviderProps {
  injectedWeb3: Web3;
  infuraWeb3: Web3;
}

export class Web3Provider extends Component<IProviderProps, {}> {

  static childContextTypes = {
    injectedWeb3: PropTypes.object,
    infuraWeb3: PropTypes.object,
  };

  getChildContext() {
    return {
      injectedWeb3: this.props.injectedWeb3,
      infuraWeb3: this.props.infuraWeb3,
    };
  }

  render() {
    return this.props.children;
  }
}

interface IComponentProps {
  web3?: Web3;
}

export const withInfura = <T extends IComponentProps>(Cmp: React.ComponentType<T>) => {
  return class extends Component<Omit<T, keyof IComponentProps>> {
    static contextTypes = {
      infuraWeb3: PropTypes.object,
    };

    static displayName = `withInfura(${Cmp.displayName || Cmp.name})`;

    render() {
      return <Cmp web3={this.context.infuraWeb3} {...this.props} />;
    }
  };
};

export const withInjectedWeb3 = <T extends IComponentProps>(Cmp: React.ComponentType<T>) => {
  return class extends Component<Omit<T, keyof IComponentProps>> {
    static contextTypes = {
      injectedWeb3: PropTypes.object,
    };

    static displayName = `withInjectedWeb3(${Cmp.displayName || Cmp.name})`;

    render() {
      return <Cmp web3={this.context.injectedWeb3} {...this.props} />;
    }
  };
};
