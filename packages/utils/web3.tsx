import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';

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

type TNetwork = 'ropsten' | 'rinkeby' | 'kovan' | 'ethereum';

const infuraNetworkMapping = new Map<TNetwork, Web3>();

export const getInfura = (network: TNetwork) => {
  if (infuraNetworkMapping.has(network)) {
    return infuraNetworkMapping.get(network);
  }
  const networkName = network === 'ethereum' ? 'mainnet' : network;
  const web3 = new Web3(new Web3.providers.HttpProvider(`https://${networkName}.infura.io/DjvHIbnUXoxqu4dPRcbB`));
  infuraNetworkMapping.set(network, web3);

  return web3;
};

interface IProviderProps {
  web3: Web3;
}

export class InfuraWeb3Provider extends Component<IProviderProps, {}> {

  static childContextTypes = {
    infuraWeb3: PropTypes.object,
  };

  getChildContext() {
    return { infuraWeb3: this.props.web3 };
  }

  render() {
    return this.props.children;
  }
}

export class InjectedWeb3Provider extends Component<IProviderProps, {}> {

  static childContextTypes = {
    injectedWeb3: PropTypes.object,
  };

  getChildContext() {
    return { injectedWeb3: this.props.web3 };
  }

  render() {
    return this.props.children;
  }
}

export const withInfura = (Cmp: React.ComponentType<IProviderProps>) => {
  return class extends Component {
    static contextTypes = {
      infuraWeb3: PropTypes.object,
    };

    static displayName = `withInfura(${Cmp.displayName})`;

    render() {
      return <Cmp web3={this.context.infuraWeb3} {...this.props} />;
    }
  };
};

export const withInjectedWeb3 = (Cmp: React.ComponentType<IProviderProps>) => {
  return class extends Component {
    static contextTypes = {
      infuraWeb3: PropTypes.object,
    };

    static displayName = `withInjectedWeb3(${Cmp.displayName})`;

    render() {
      return <Cmp web3={this.context.injectedWeb3} {...this.props} />;
    }
  };
};
