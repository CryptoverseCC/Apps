import { getCurrentNetworkName, getAccounts } from './utils';
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

  return new Promise((resolve, reject) => {
    contract.post(JSON.stringify(claim), { from }, getResolveOrRejectOnErrorFunc(resolve, reject));
  });
}

export async function sendClaimValueTransfer(web3Instance, address, value, claim) {
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

export async function sendClaimTokenTransfer(
  web3Instance,
  recipientAddress,
  token,
  value,
  unlimitedApproval,
  claim,
) {
  const decimals = await erc20ContractDecimals(web3Instance, token);
  const tokenWei = valueToTokenWei(web3Instance, value, decimals);
  const allowance = await allowanceUserfeedsContractTokenTransfer(web3Instance, token);
  if (tokenWei >= allowance) {
    const approveValue = unlimitedApproval ? 1e66 : tokenWei;
    await approveUserfeedsContractTokenTransfer(web3Instance, token, approveValue);
  }
  return sendClaimTokenTransferImpl(web3Instance, recipientAddress, token, tokenWei, claim);
}

function valueToTokenWei(web3Instance, value, decimals) {
  return web3Instance.toBigNumber(value).shift(-decimals);
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
