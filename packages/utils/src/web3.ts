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
