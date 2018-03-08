import { extendObservable, computed, action, observable } from 'mobx';
import { networkMapping } from '@userfeeds/core/src/utils';
import { fromWeiToString } from '@linkexchange/utils/balance';
import {
  sendClaimTokenTransfer,
  sendClaimValueTransfer,
  sendClaimWithoutValueTransfer,
  approveUserfeedsContractTokenTransfer,
} from '@userfeeds/core/src/ethereumClaims';
import Web3 from 'web3';
import { BN } from 'web3-utils';
import { TNetwork } from '@linkexchange/utils/web3';
import { PromiEvent, TransactionReceipt } from 'web3/types';
import Erc20, { IErc20Constructor } from './erc20';

interface IInitialState {
  asset?: string;
  currentProvider?: any;
  isListening?: boolean;
  injectedWeb3ActiveNetwork?: TNetwork;
  decimals?: number;
  balance?: string | undefined;
  allowance?: string | undefined;
}

export interface IWeb3Store {
  asset: string;
  changeAssetTo(asset: string): void;
  token: string;
  network: string;
  blockNumber?: number;
  decimals?: number;
  symbol?: string;
  name?: string;
  currentAccount?: string;
  balance?: string;
  balanceWithDecimalPoint?: string;
  allowance?: string;
  allowanceWithDecimalPoint?: string;
  sendClaim: (
    claim: any,
    recipientAddress?: string,
    value?: string,
  ) => Promise<{
    promiEvent: PromiEvent<TransactionReceipt>;
  }>;
  shouldApprove: (value: string) => boolean;
  approve: (
    value: string,
  ) => Promise<{
    promiEvent: PromiEvent<TransactionReceipt>;
  }>;
  getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt | undefined>;
  reason?: string;
  unlocked?: boolean;
  infuraWeb3?: Web3;
}

export default class Web3Store implements IWeb3Store {
  updateInjectedWeb3StateIntervalId: any;
  updateTokenDetailsIntervalId: any;

  @observable currentProvider: any;
  @observable isListening: boolean;
  @observable injectedWeb3ActiveNetwork: TNetwork;
  @observable currentAccount: string;
  @observable blockNumber: number | undefined;

  @observable asset: string;

  @observable decimals: number;
  @observable symbol: string;
  @observable name: string;
  @observable balance: string;
  @observable allowance: string;

  constructor(
    private injectedWeb3: Web3,
    private Erc20Ctor: IErc20Constructor,
    initialState: IInitialState = {
      asset: '',
      currentProvider: undefined,
      isListening: undefined,
      allowance: undefined,
    },
  ) {
    this.asset = initialState.asset!;
    this.currentProvider = initialState.currentProvider;
    this.isListening = initialState.isListening!;
    this.injectedWeb3ActiveNetwork = initialState.injectedWeb3ActiveNetwork!;
    this.allowance = initialState.allowance!;
    this.decimals = initialState.decimals!;
    this.balance = initialState.balance!;
    this.startUpdatingInjectedWeb3State();
    this.startUpdatingTokenDetails();
  }

  startUpdatingInjectedWeb3State() {
    this.updateInjectedWeb3State();
    clearInterval(this.updateInjectedWeb3StateIntervalId);
    this.updateInjectedWeb3StateIntervalId = setInterval(this.updateInjectedWeb3State, 1000);
  }

  startUpdatingTokenDetails() {
    this.updateTokenDetails();
    clearInterval(this.updateTokenDetailsIntervalId);
    this.updateTokenDetailsIntervalId = setInterval(this.updateTokenDetails, 1000);
  }

  stopUpdating() {
    clearInterval(this.updateInjectedWeb3StateIntervalId);
    clearInterval(this.updateTokenDetailsIntervalId);
  }

  tokenRequests() {
    if (!this.ready) {
      return [undefined, undefined, undefined, undefined, undefined];
    } else if (this.token) {
      return [
        this.erc20.decimals(),
        this.erc20.symbol(),
        this.erc20.name(),
        this.erc20.balance(),
        this.erc20.allowance(),
      ];
    } else {
      return [18, 'ETH', 'ETH', this.injectedWeb3.eth.getBalance(this.currentAccount), undefined];
    }
  }

  @action.bound
  changeAssetTo(asset: string) {
    this.asset = asset;
  }

  @action.bound
  async updateTokenDetails() {
    const [decimals, symbol, name, balance, allowance] = await Promise.all(this.tokenRequests());
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
    this.balance = balance;
    this.allowance = allowance;
  }

  @action.bound
  async updateInjectedWeb3State() {
    this.currentProvider = this.injectedWeb3.currentProvider;
    if (!this.currentProvider) {
        const currentBlock = await this.erc20.currentBlock();
        this.blockNumber = currentBlock;
      return;
    }
    const [isListening, networkId, accounts, currentBlock] = await Promise.all([
      this.injectedWeb3.eth.net.isListening(),
      this.injectedWeb3.eth.net.getId(),
      this.injectedWeb3.eth.getAccounts(),
      this.injectedWeb3.eth.getBlockNumber(),
    ]);
    this.isListening = isListening;
    this.injectedWeb3ActiveNetwork = networkMapping[networkId];
    this.currentAccount = accounts[0];
    this.blockNumber = currentBlock;
  }

  @computed
  get erc20() {
    return new this.Erc20Ctor(this.network, this.token, this.currentAccount);
  }

  @computed
  get activeNetwork() {
    return this.ready ? this.injectedWeb3ActiveNetwork : undefined;
  }

  @computed
  get reason() {
    if (!this.currentProvider) {
      return 'Install Metamask to unlock all the features';
    } else if (!this.currentAccount) {
      return 'Unlock your wallet to unlock all the features';
    } else if (this.activeNetwork !== this.network) {
      return `Switch to ${this.network} network to unlock all the features`;
    }
  }

  @computed
  get unlocked() {
    return !!(this.ready && this.currentAccount);
  }

  @computed
  get ready() {
    return !!(this.currentProvider && this.isListening);
  }

  @computed
  get network() {
    return this.asset.split(':')[0] as TNetwork;
  }

  @computed
  get token() {
    return this.asset.split(':')[1];
  }

  @computed
  get balanceWithDecimalPoint() {
    return this.balance !== null && this.balance !== undefined
      ? fromWeiToString(this.balance, this.decimals)
      : undefined;
  }

  @computed
  get allowanceWithDecimalPoint() {
    return this.allowance !== null && this.allowance !== undefined
      ? fromWeiToString(this.allowance, this.decimals)
      : undefined;
  }

  sendTokenClaim = (claim, recipientAddress?, value?) => {
    if (value === undefined) {
      return sendClaimWithoutValueTransfer(this.injectedWeb3, claim);
    } else {
      return sendClaimTokenTransfer(this.injectedWeb3, recipientAddress, this.token, value, claim);
    }
  };

  sendEthereumClaim = (claim, recipientAddress?, value?) => {
    if (value === undefined) {
      return sendClaimWithoutValueTransfer(this.injectedWeb3, claim);
    } else {
      return sendClaimValueTransfer(this.injectedWeb3, recipientAddress, value, claim);
    }
  };

  @computed
  get sendClaim(): (
    claim: any,
    recipientAddress?: string,
    value?: string,
  ) => Promise<{
    promiEvent: PromiEvent<TransactionReceipt>;
  }> {
    return this.token ? this.sendTokenClaim : this.sendEthereumClaim;
  }

  shouldApprove = (value: string) => {
    return !!this.token && (new BN(this.allowance).lt(new BN(value)) as boolean);
  };

  approve = (value: string) => {
    return approveUserfeedsContractTokenTransfer(this.injectedWeb3, this.token, value);
  };

  async transactionReceipt(transactionHash: string) {
    try {
      const response = await this.injectedWeb3.eth.getTransactionReceipt(transactionHash);
      return response;
    } catch (e) {
      return undefined;
    }
  }

  @computed
  get getTransactionReceipt(): (transactionHash: string) => Promise<TransactionReceipt | undefined> {
    return this.ready && this.network === this.injectedWeb3ActiveNetwork
      ? this.transactionReceipt
      : this.erc20.transactionReceipt;
  }
}
