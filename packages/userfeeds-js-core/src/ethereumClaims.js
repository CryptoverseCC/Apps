const { getCurrentNetworkName, getAccounts } = require('./utils');
const {
  payableAbi,
  notpayableAbi,
  getContractAddress,
} = require('./utils/contract');

async function sendPayableClaim(web3Instance, address, claim, value) {
  const networkName = await getCurrentNetworkName(web3Instance);
  const [from] = await getAccounts(web3Instance);

  const contract = web3Instance.eth.contract(payableAbi)
    .at(getContractAddress(networkName, true));

  return new Promise((resolve, reject) => {
    contract.post(
      address,
      JSON.stringify(claim),
      { from, value: web3Instance.toWei(value, 'ether') },
      (errror, result) => {
        if (errror) {
          return reject(errror);
        }
        return resolve(result);
      },
    );
  });
}

async function sendNotpayableClaim(web3Instance, address, claim) {
  const networkName = await getCurrentNetworkName(web3Instance)
  const [from] = await getAccounts(web3Instance);

  const contract = web3Instance.eth.contract(notpayableAbi)
    .at(getContractAddress(networkName, false));

  return new Promise((resolve, reject) => {
    contract.post(
      JSON.stringify(claim),
      { from },
      (errror, result) => {
        if (errror) {
          return reject(errror);
        }
        return resolve(result);
      },
    );
  });
}

function sendClaim(web3Instance, address, claim, value) {
  const payable = value !== undefined;

  return payable
    ? sendPayableClaim(web3Instance, address, claim, value)
    : sendNotpayableClaim(web3Instance, address, claim);
}

module.exports = {
  sendClaim,
  sendPayableClaim,
  sendNotpayableClaim,
};

