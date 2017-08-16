
const networkMapping = {
  '1': 'ethereum',
  '3': 'ropsten',
  '4': 'rinkeby',
  '42': 'kovan',
};

function getCurrentNetworkName(web3Instance) {
  return new Promise((resolve, reject) => {
    if (!web3Instance.isConnected()) {
      return resolve(undefined);
    }

    web3Instance.version.getNetwork((error, networkId) => {
      if (error) {
        return reject(error);
      }

      resolve(networkMapping[networkId]);
    });
  });
}

function getAccounts(web3Instance) {
  return new Promise((resolve, reject) => {
    if (!web3Instance.isConnected()) {
      return resolve(undefined);
    }

    web3Instance.eth.getAccounts((error, accounts = []) => {
      if (error) {
        return reject(error);
      }

      resolve(accounts);
    });
  });
}

module.exports = {
  getAccounts,
  getCurrentNetworkName,
};

