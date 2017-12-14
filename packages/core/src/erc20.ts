import { getAccounts, resolveOnTransationHash } from './utils';
import { getErc20Contract } from './utils/contract';

export async function erc20ContractApprove(web3Instance, contractAddress, spender, value) {
  const [from] = await getAccounts(web3Instance);
  const contract = getErc20Contract(web3Instance, contractAddress);

  return resolveOnTransationHash(
    contract.methods.approve(spender, value).send({ from }),
  );
}

export async function erc20ContractAllowance(web3Instance, contractAddress, spender) {
  const [from] = await getAccounts(web3Instance);
  const contract = getErc20Contract(web3Instance, contractAddress);
  return contract.methods.allowance(from, spender).call();
}

export async function erc20ContractBalance(web3Instance, contractAddress): Promise<any> {
  const [from] = await getAccounts(web3Instance);
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
