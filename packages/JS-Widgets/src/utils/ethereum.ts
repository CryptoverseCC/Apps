const networkMapping = new Map<string, string>();
networkMapping.set('1', 'ethereum');
networkMapping.set('3', 'ropsten');
networkMapping.set('4', 'rinkeby');
networkMapping.set('42', 'kovan');

export const checkNetwork = (expectedNetwork) => {
  if (!web3) {
    return false;
  }

  return networkMapping[web3.version.network] === expectedNetwork;
};

export const checkCurrentAccount = (expectedAccount) => {
  if (!web3) {
    return false;
  }
  return web3.eth.accounts[0] === expectedAccount;
};
