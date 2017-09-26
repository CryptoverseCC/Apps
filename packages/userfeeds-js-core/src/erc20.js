const { getErc20Contract } = require('./utils/contract');

async function erc20ContractApprove(web3Instance, contractAddress, spender, value) {
  const [from] = await getAccounts(web3Instance);
  const contract = getErc20Contract(web3Instance, contractAddress);
  return new Promise((resolve, reject) => {
    contract.approve(
      spender,
      value,
      { from },
      getResolveOrRejectOnErrorFunc(resolve, reject),
    );
  });
}

function getErc20ContractDecimals(web3Instance, contractAddress) {
  const contract = getErc20Contract(web3Instance, contractAddress);
  return new Promise((resolve, reject) => {
    contract.decimals(
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
  erc20ContractApprove,
  getErc20ContractDecimals,
};
