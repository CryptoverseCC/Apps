import Web3 from 'web3';
import {
  erc20ContractDecimals,
  erc20ContractSymbol,
  erc20ContractName,
  erc20ContractBalanceForAccount,
} from '@userfeeds/core/src/erc20';
import { allowanceUserfeedsContractTokenTransferForAccount } from '@userfeeds/core/src/ethereumClaims';
import Erc20Cache from './erc20Cache';

export interface IErc20Constructor {
  new (network: string, token: string, account: string, cache?: Erc20Cache): Erc20
}
export default class Erc20 {
  web3: Web3;

  constructor(private network, private token, private account, private cache = new Erc20Cache(network, token)) {
    const networkName = network === 'ethereum' ? 'mainnet' : network;
    this.web3 = new Web3(new Web3.providers.HttpProvider(`https://${networkName}.infura.io/DjvHIbnUXoxqu4dPRcbB`));
  }

  transactionReceipt = async (transactionHash: string) => {
    try {
      const response = await this.web3.eth.getTransactionReceipt(transactionHash);
      return response;
    } catch (e) {
      return undefined;
    }
  }

  async currentBlock(): Promise<number | undefined> {
    try {
      const response = await this.web3.eth.getBlockNumber();
      return response;
    } catch (e) {
      return undefined;
    }
  }

  async decimals(): Promise<number | undefined> {
    if (this.cache.decimals) {
      return parseInt(this.cache.decimals, 10);
    }
    try {
      const response = await erc20ContractDecimals(this.web3, this.token);
      this.cache.decimals = response;
      return parseInt(response, 10);
    } catch (e) {
      return undefined;
    }
  }

  async symbol(): Promise<string | undefined> {
    if (this.cache.symbol) {
      return this.cache.symbol;
    }
    try {
      const response = await erc20ContractSymbol(this.web3, this.token);
      this.cache.symbol = response;
      return response;
    } catch (e) {
      return undefined;
    }
  }

  async name(): Promise<string | undefined> {
    if (this.cache.name) {
      return this.cache.name;
    }
    try {
      const response = await erc20ContractName(this.web3, this.token);
      this.cache.name = response;
      return name;
    } catch (e) {
      return undefined;
    }
  }

  async balance() {
    try {
      return await erc20ContractBalanceForAccount(this.web3, this.token, this.account);
    } catch (e) {
      return undefined;
    }
  }

  async allowance() {
    try {
      return await allowanceUserfeedsContractTokenTransferForAccount(this.web3, this.network, this.token, this.account);
    } catch (e) {
      return undefined;
    }
  }
}
