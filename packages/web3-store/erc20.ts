import Web3 from 'web3';
import {
  erc20ContractDecimals,
  erc20ContractSymbol,
  erc20ContractName,
  erc20ContractBalance,
} from '@userfeeds/core/src/erc20';
import { allowanceUserfeedsContractTokenTransfer } from '@userfeeds/core/src/ethereumClaims';

export default class Erc20 {
  web3: Web3;

  constructor(private network, private token) {
    const networkName = network === 'ethereum' ? 'mainnet' : network;
    this.web3 = new Web3(new Web3.providers.HttpProvider(`https://${networkName}.infura.io/DjvHIbnUXoxqu4dPRcbB`));
  }

  async decimals() {
    try {
      const response = await erc20ContractDecimals(this.web3, this.token);
      return parseInt(response, 10);
    } catch (e) {
      return undefined;
    }
  }

  async symbol() {
    try {
      return await erc20ContractSymbol(this.web3, this.token);
    } catch (e) {
      return undefined;
    }
  }

  async name() {
    try {
      return await erc20ContractName(this.web3, this.token);
    } catch (e) {
      return undefined;
    }
  }

  async balance() {
    try {
      return await erc20ContractBalance(this.web3, this.token);
    } catch (e) {
      return undefined;
    }
  }

  async approval() {
    try {
      return await allowanceUserfeedsContractTokenTransfer(this.web3, this.token);
    } catch (e) {
      return undefined;
    }
  }
}
