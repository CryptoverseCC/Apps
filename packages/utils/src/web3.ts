import Web3 from 'web3';

const web3 = new Web3();

setTimeout(() => {
  if (typeof window.web3 !== 'undefined') {
    web3.setProvider(window.web3.currentProvider);
  }
});

export default web3;
