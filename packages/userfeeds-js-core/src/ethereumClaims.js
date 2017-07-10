const { getCurrentNetworkName } = require('./utils');
const {
  payableAbi,
  notpayableAbi,
  getContractAddress,
} = require('./utils/contract');

function sendPayableClaim(address, claim, value) {
  const contract = web3.eth.contract(payableAbi)
    .at(getContractAddress(getCurrentNetworkName(), true));

  return new Promise((resolve, reject) => {
    contract.post(
      address,
      JSON.stringify(claim),
      { value: web3.toWei(value, 'ether') },
      (errror, result) => {
        if (errror) {
          return reject(errror);
        }
        return resolve(result);
      },
    );
  });
}

function sendNotpayableClaim(address, claim) {
  const contract = web3.eth.contract(payableAbi)
    .at(getContractAddress(getCurrentNetworkName(), false));

  return new Promise((resolve, reject) => {
    contract.post(
      address,
      JSON.stringify(claim),
      (errror, result) => {
        if (errror) {
          return reject(errror);
        }
        return resolve(result);
      },
    );
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

