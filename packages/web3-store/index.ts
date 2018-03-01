import { observable, extendObservable, computed, observe, action } from 'mobx';
import { networkMapping } from '@userfeeds/core/src/utils';
import { fromWeiToString } from '@linkexchange/utils/balance';

export default class Web3Store {
  stopUpdatingInjectedWeb3State: any;
  stopUpdatingTokenDetails: any;

  currentProvider: any;
  isListening: boolean;
  injectedWeb3ActiveNetwork: string;
  currentAccount: string;

  asset: string;

  decimals: number;
  symbol: string;
  name: string;
  balance: string;

  constructor(private injectedWeb3, private erc20, initialState) {
    extendObservable(this, initialState);
    this.startUpdatingInjectedWeb3State();
    this.startUpdatingTokenDetails();
  }

  startUpdatingInjectedWeb3State() {
    this.updateInjectedWeb3State();
    this.stopUpdatingInjectedWeb3State = setInterval(this.updateInjectedWeb3State, 1000);
  }

  startUpdatingTokenDetails() {
    this.updateTokenDetails();
    this.stopUpdatingTokenDetails = setInterval(this.updateTokenDetails, 1000);
  }

  tokenRequests() {
    return this.token
      ? [
          this.erc20.decimals(this.injectedWeb3, this.token),
          this.erc20.symbol(this.injectedWeb3, this.token),
          this.erc20.name(this.injectedWeb3, this.token),
          this.erc20.balance(this.injectedWeb3, this.token),
        ]
      : [18, 'ETH', 'ETH', this.injectedWeb3.eth.getBalance()];
  }

  @action.bound
  async updateTokenDetails() {
    const [decimals, symbol, name, balance] = await Promise.all(this.tokenRequests());
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
    this.balance = balance;
  }

  @action.bound
  async updateInjectedWeb3State() {
    this.currentProvider = this.injectedWeb3.currentProvider;
    const [isListening, networkId, accounts] = await Promise.all([
      this.injectedWeb3.eth.net.isListening(),
      this.injectedWeb3.eth.net.getId(),
      this.injectedWeb3.eth.getAccounts(),
    ]);
    this.isListening = isListening;
    this.injectedWeb3ActiveNetwork = networkMapping[networkId];
    this.currentAccount = accounts[0];
  }

  @computed
  get activeNetwork() {
    return this.ready ? this.injectedWeb3ActiveNetwork : undefined;
  }

  @computed
  get reason() {
    if (!this.currentProvider || !this.isListening) {
      return 'Enable Metamask to unlock all the features';
    }
  }

  @computed
  get ready() {
    return !!(this.currentProvider && this.isListening);
  }

  @computed
  get network() {
    return this.asset.split(':')[0];
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
}
