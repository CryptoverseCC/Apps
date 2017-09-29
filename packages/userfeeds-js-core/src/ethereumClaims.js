const { getCurrentNetworkName, getAccounts } = require('./utils');
const { erc20ContractApprove, erc20ContractAllowance } = require('./erc20');
const {
  getContractWithoutValueTransfer,
  getContractValueTransfer,
  getContractTokenTransfer,
  getContractTokenTransferAddress,
} = require('./utils/contract');

async function sendClaimWithoutValueTransfer(web3Instance, claim) {
  const networkName = await getCurrentNetworkName(web3Instance);
  const [from] = await getAccounts(web3Instance);

  const contract = getContractWithoutValueTransfer(web3Instance, networkName);

  return new Promise((resolve, reject) => {
    contract.post(
      JSON.stringify(claim),
      { from },
      getResolveOrRejectOnErrorFunc(resolve, reject),
    );
  });
}

async function sendClaimValueTransfer(web3Instance, address, value, claim) {
  const networkName = await getCurrentNetworkName(web3Instance);
  const [from] = await getAccounts(web3Instance);

  const contract = getContractValueTransfer(web3Instance, networkName);

  return new Promise((resolve, reject) => {
    contract.post(
      address,
      JSON.stringify(claim),
      { from, value: web3Instance.toWei(value, 'ether') },
      getResolveOrRejectOnErrorFunc(resolve, reject),
    );
  });
}

async function approveUserfeedsContractTokenTransfer(web3Instance, tokenContractAddress, value) {
  const networkName = await getCurrentNetworkName(web3Instance);
  const spenderContractAddress = getContractTokenTransferAddress(networkName);
  return erc20ContractApprove(web3Instance, tokenContractAddress, spenderContractAddress, value);
}

async function allowanceUserfeedsContractTokenTransfer(web3Instance, tokenContractAddress) {
  const networkName = await getCurrentNetworkName(web3Instance);
  const spenderContractAddress = getContractTokenTransferAddress(networkName);
  return erc20ContractAllowance(web3Instance, tokenContractAddress, spenderContractAddress);
}

async function sendClaimTokenTransfer(web3Instance, address, token, value, claim) {
  const networkName = await getCurrentNetworkName(web3Instance);
  const [from] = await getAccounts(web3Instance);

  const contract = getContractTokenTransfer(web3Instance, networkName);

  return new Promise((resolve, reject) => {
    contract.post(
      address,
      token,
      value,
      JSON.stringify(claim),
      { from },
      getResolveOrRejectOnErrorFunc(resolve, reject),
    );
  });
}

function getResolveOrRejectOnErrorFunc(resolve, reject) {
  return function(error, result) {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  };
}

module.exports = {
  sendClaimWithoutValueTransfer,
  sendClaimValueTransfer,
  approveUserfeedsContractTokenTransfer,
  allowanceUserfeedsContractTokenTransfer,
  sendClaimTokenTransfer,
};

