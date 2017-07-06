const networkMapping = {
  '1': 'ethereum',
  '3': 'ropsten',
  '4': 'rinkeby',
  '42': 'kovan',
};

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
