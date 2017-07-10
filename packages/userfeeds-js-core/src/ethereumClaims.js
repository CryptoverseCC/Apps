const { getCurrentNetworkName } = require('./utils');
const {
  payableAbi,
  notpayableAbi,
  getContractAddress,
} = require('./utils/contract');

function sendClaim(address, claim, value) {
  const payable = value !== undefined;
  const abi = payable ? payableAbi : notpayableAbi;
  const contract = web3.eth.contract(abi)
    .at(getContractAddress(getCurrentNetworkName(), payable));

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

module.exports = {
  sendClaim,
};

