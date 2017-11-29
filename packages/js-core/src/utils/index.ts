const networkMapping = {
  1: 'ethereum',
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan',
};

export function getBlock(web3Instance, blockNumber): Promise<{
  timestamp: number;
}> {
  return new Promise((resolve, reject) => {
    if (!web3Instance.isConnected()) {
      return reject('web3 is not connected');
    }

    web3Instance.eth.getBlock(blockNumber, (error, blockInfo) => {
      if (error) {
        reject(error);
      }

      resolve(blockInfo);
    });
  });
}

export function getBlockNumber(web3Instance): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!web3Instance.isConnected()) {
      return reject('web3 is not connected');
    }

    web3Instance.eth.getBlockNumber((error, blockNumber) => {
      if (error) {
        reject(error);
      }

      resolve(blockNumber);
    });
  });
}

export function getCurrentNetworkName(web3Instance): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!web3Instance.isConnected()) {
      return reject('web3 is not connected');
    }

    web3Instance.version.getNetwork((error, networkId) => {
      if (error) {
        return reject(error);
      }

      resolve(networkMapping[networkId]);
    });
  });
}

export function getAccounts(web3Instance): Promise<string[]> {
  return new Promise((resolve, reject) => {
    if (!web3Instance.isConnected()) {
      return reject('web3 is not connected');
    }

    web3Instance.eth.getAccounts((error, accounts = []) => {
      if (error) {
        return reject(error);
      }

      resolve(accounts);
    });
  });
}

export function getTransactionReceipt(web3Instance, transactionId): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!web3Instance.isConnected()) {
      return reject('web3 is not connected');
    }

    web3Instance.eth.getTransactionReceipt(transactionId, (error, receipt) => {
      if (error) {
        return reject(error);
      }

      resolve(receipt);
    });
  });
}
