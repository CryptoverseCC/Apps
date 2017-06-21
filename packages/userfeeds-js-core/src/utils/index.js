
const networkMapping = {
  '1': 'ethereum',
  '3': 'ropsten',
  '4': 'rinkeby',
  '42': 'kovan',
};

function getCurrentNetworkName() {
  if (!web3) {
    throw new Error('web3 not available');
  }

  return networkMapping[web3.version.network];
}

module.exports = {
  getCurrentNetworkName,
};

