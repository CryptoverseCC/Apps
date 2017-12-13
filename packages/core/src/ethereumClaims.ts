import { toWei } from '@linkexchange/utils/balance';

import { getCurrentNetworkName, getAccounts, resolveOnTransationHash } from './utils';
import { erc20ContractApprove, erc20ContractAllowance, erc20ContractDecimals } from './erc20';
import {
  getContractWithoutValueTransfer,
  getContractValueTransfer,
  getContractTokenTransfer,
  getContractTokenTransferAddress,
} from './utils/contract';

export async function sendClaimWithoutValueTransfer(web3Instance, claim) {
  const networkName = await getCurrentNetworkName(web3Instance);
  const [from] = await getAccounts(web3Instance);

  const contract = getContractWithoutValueTransfer(web3Instance, networkName);

  return resolveOnTransationHash(
    contract.methods.post(JSON.stringify(claim)).send({ from }),
  );
}

export async function sendClaimValueTransfer(web3Instance, address, value, claim) {
  const networkName = await getCurrentNetworkName(web3Instance);
  const [from] = await getAccounts(web3Instance);

  const contract = getContractValueTransfer(web3Instance, networkName);
  return resolveOnTransationHash(
    contract.methods
      .post(address, JSON.stringify(claim))
      .send({ from, value: toWei(value, 18) }),
  );
}

export async function approveUserfeedsContractTokenTransfer(
  web3Instance,
  tokenContractAddress,
  value,
) {
  const networkName = await getCurrentNetworkName(web3Instance);
  const spenderContractAddress = getContractTokenTransferAddress(networkName);
  return erc20ContractApprove(web3Instance, tokenContractAddress, spenderContractAddress, value);
}

export async function allowanceUserfeedsContractTokenTransfer(web3Instance, tokenContractAddress) {
  const networkName = await getCurrentNetworkName(web3Instance);
  const spenderContractAddress = getContractTokenTransferAddress(networkName);
  return erc20ContractAllowance(web3Instance, tokenContractAddress, spenderContractAddress);
}

export async function sendClaimTokenTransferImpl(web3Instance, address, token, value, claim) {
  const networkName = await getCurrentNetworkName(web3Instance);
  const [from] = await getAccounts(web3Instance);
  const contract = getContractTokenTransfer(web3Instance, networkName);

  return resolveOnTransationHash(
    contract.methods.post(
      address,
      token,
      value,
      JSON.stringify(claim),
    ).send({ from }),
  );
}

export async function sendClaimTokenTransfer(
  web3Instance,
  recipientAddress,
  token,
  value,
  unlimitedApproval,
  claim,
) {
  const decimals = await erc20ContractDecimals(web3Instance, token);
  const tokenWei = toWei(value, decimals);
  const allowance = await allowanceUserfeedsContractTokenTransfer(web3Instance, token);
  if (tokenWei >= allowance) {
    const approveValue = unlimitedApproval ? 1e66 : tokenWei;
    await approveUserfeedsContractTokenTransfer(web3Instance, token, approveValue);
  }
  return sendClaimTokenTransferImpl(web3Instance, recipientAddress, token, tokenWei, claim);
}
