const { getCurrentNetworkName } = require('./utils');
const {
  payableAbi,
  notpayableAbi,
  getContractAddress,
} = require('./utils/contract');

function sendPayableClaim(web3Instance, address, claim, value) {
  return getCurrentNetworkName(web3Instance)
    .then((networkName) => {
      const contract = web3Instance.eth.contract(payableAbi)
        .at(getContractAddress(networkName, true));

      return new Promise((resolve, reject) => {
        contract.post(
          address,
          JSON.stringify(claim),
          { value: web3Instance.toWei(value, 'ether') },
          (errror, result) => {
            if (errror) {
              return reject(errror);
            }
            return resolve(result);
          },
        );
      });
    });
}

function sendNotpayableClaim(web3Instance, address, claim) {
  return getCurrentNetworkName(web3Instance)
    .then((networkName) => {
      const contract = web3Instance.eth.contract(notpayableAbi)
        .at(getContractAddress(networkName, false));

      return new Promise((resolve, reject) => {
        contract.post(
          JSON.stringify(claim),
          (errror, result) => {
            if (errror) {
              return reject(errror);
            }
            return resolve(result);
          },
        );
      });
    });
}

function sendClaim(address, claim, value) {
  const payable = value !== undefined;

  return payable
    ? sendPayableClaim(address, claim, value)
    : sendNotpayableClaim(address, claim);
}

module.exports = {
  sendClaim,
  sendPayableClaim,
  sendNotpayableClaim,
};

