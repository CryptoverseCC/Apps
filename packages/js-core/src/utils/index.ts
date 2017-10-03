const networkMapping = {
  '1': 'ethereum',
  '3': 'ropsten',
  '4': 'rinkeby',
  '42': 'kovan',
};

export function getCurrentNetworkName(web3Instance) {
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

export function getAccounts(web3Instance): Promise<Array<any>> {
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
