
const networkMapping = {
  '1': 'ethereum',
  '3': 'ropsten',
  '4': 'rinkeby',
  '42': 'kovan',
};

function getCurrentNetworkName(web3Instance) {
  return new Promise((resolve, reject) => {
    if (!web3Instance.isConnected()) {
      return reject(new Error('web3 not available'));
    }

    web3Instance.version.getNetwork((error, networkId) => {
      if (error) {
        return reject(error);
      }

      resolve(networkMapping[networkId]);
    })
  });
}

module.exports = {
  getCurrentNetworkName,
};

