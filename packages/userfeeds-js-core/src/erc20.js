const { getAccounts } = require('./utils');
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

function erc20ContractAllowance(web3Instance, contractAddress, owner, spender) {
  const contract = getErc20Contract(web3Instance, contractAddress);
  return new Promise((resolve, reject) => {
    contract.allowance(
      owner,
      spender,
      getResolveOrRejectOnErrorFunc(resolve, reject),
    );
  });
}

function erc20ContractBalance(web3Instance, contractAddress, owner) {
  const contract = getErc20Contract(web3Instance, contractAddress);
  return new Promise((resolve, reject) => {
    contract.balanceOf(
      owner,
      getResolveOrRejectOnErrorFunc(resolve, reject),
    );
  });
}

function erc20ContractDecimals(web3Instance, contractAddress) {
  const contract = getErc20Contract(web3Instance, contractAddress);
  return new Promise((resolve, reject) => {
    contract.decimals(
      getResolveOrRejectOnErrorFunc(resolve, reject),
    );
  });
}

function erc20ContractName(web3Instance, contractAddress) {
  const contract = getErc20Contract(web3Instance, contractAddress);
  return new Promise((resolve, reject) => {
    contract.name(
      getResolveOrRejectOnErrorFunc(resolve, reject),
    );
  });
}

function getErc20ContractSymbol(web3Instance, contractAddress) {
  const contract = getErc20Contract(web3Instance, contractAddress);
  return new Promise((resolve, reject) => {
    contract.symbol(
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
  erc20ContractAllowance,
  erc20ContractBalance,
  erc20ContractDecimals,
  erc20ContractName,
  getErc20ContractSymbol,
};
