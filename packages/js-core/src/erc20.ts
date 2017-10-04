import { getAccounts } from './utils';
import { getErc20Contract } from './utils/contract';

export async function erc20ContractApprove(web3Instance, contractAddress, spender, value) {
  const [from] = await getAccounts(web3Instance);
  const contract = getErc20Contract(web3Instance, contractAddress);
  return new Promise((resolve, reject) => {
    contract.approve(spender, value, { from }, getResolveOrRejectOnErrorFunc(resolve, reject));
  });
}

export async function erc20ContractAllowance(web3Instance, contractAddress, spender) {
  const [from] = await getAccounts(web3Instance);
  const contract = getErc20Contract(web3Instance, contractAddress);
  return new Promise((resolve, reject) => {
    contract.allowance(from, spender, getResolveOrRejectOnErrorFunc(resolve, reject));
  });
}

export async function erc20ContractBalance(web3Instance, contractAddress) {
  const [from] = await getAccounts(web3Instance);
  const contract = getErc20Contract(web3Instance, contractAddress);
  return new Promise((resolve, reject) => {
    contract.balanceOf(from, getResolveOrRejectOnErrorFunc(resolve, reject));
  });
}

export function erc20ContractDecimals(web3Instance, contractAddress) {
  const contract = getErc20Contract(web3Instance, contractAddress);
  return new Promise((resolve, reject) => {
    contract.decimals(getResolveOrRejectOnErrorFunc(resolve, reject));
  });
}

export function erc20ContractName(web3Instance, contractAddress) {
  const contract = getErc20Contract(web3Instance, contractAddress);
  return new Promise((resolve, reject) => {
    contract.name(getResolveOrRejectOnErrorFunc(resolve, reject));
  });
}

export function erc20ContractSymbol(web3Instance, contractAddress) {
  const contract = getErc20Contract(web3Instance, contractAddress);
  return new Promise((resolve, reject) => {
    contract.symbol(getResolveOrRejectOnErrorFunc(resolve, reject));
  });
}

function getResolveOrRejectOnErrorFunc(resolve, reject) {
  return (error, result) => {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  };
}
