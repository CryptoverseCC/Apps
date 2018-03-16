import { getAccounts } from './utils';
import { getErc20Contract } from './utils/contract';
import { PromiEvent, TransactionReceipt } from 'web3/types';

export async function erc20ContractApprove(
  web3Instance,
  contractAddress,
  spender,
  value,
): Promise<{ promiEvent: PromiEvent<TransactionReceipt> }> {
  const [from] = await getAccounts(web3Instance);
  const contract = getErc20Contract(web3Instance, contractAddress);

  return {
    promiEvent: contract.methods.approve(spender, value).send({ from }),
  };
}

export async function erc20ContractAllowance(web3Instance, contractAddress, spender) {
  const [from] = await getAccounts(web3Instance);
  const contract = getErc20Contract(web3Instance, contractAddress);
  return contract.methods.allowance(from, spender).call();
}

export async function erc20ContractAllowanceForAccount(web3Instance, contractAddress, spender, from) {
  const contract = getErc20Contract(web3Instance, contractAddress);
  return contract.methods.allowance(from, spender).call();
}

export async function erc20ContractBalance(web3Instance, contractAddress): Promise<any> {
  const [from] = await getAccounts(web3Instance);
  const contract = getErc20Contract(web3Instance, contractAddress);
  return contract.methods.balanceOf(from).call();
}

export async function erc20ContractBalanceForAccount(web3Instance, contractAddress, from) {
  const contract = getErc20Contract(web3Instance, contractAddress);
  return contract.methods.balanceOf(from).call();
}

export function erc20ContractDecimals(web3Instance, contractAddress): Promise<any> {
  const contract = getErc20Contract(web3Instance, contractAddress);
  return contract.methods.decimals().call();
}

export function erc20ContractName(web3Instance, contractAddress): Promise<string> {
  const contract = getErc20Contract(web3Instance, contractAddress);
  return contract.methods.name().call();
}

export function erc20ContractSymbol(web3Instance, contractAddress): Promise<string> {
  const contract = getErc20Contract(web3Instance, contractAddress);
  return contract.methods.symbol().call();
}
