import { observable, extendObservable, computed, observe, action } from 'mobx';
import { networkMapping } from '@userfeeds/core/src/utils';

class Web3Store {
  stopUpdatingInjectedWeb3State: any;

  currentProvider: any;
  isListening: boolean;
  injectedWeb3ActiveNetwork: string;
  currentAccount: string;

  asset: string;

  decimals: number;
  symbol: string;
  name: string;
  balance: string;
  approval: string;

  constructor(private injectedWeb3, private erc20, initialState) {
    extendObservable(this, initialState);
    this.startUpdatingInjectedWeb3State();
  }

  startUpdatingInjectedWeb3State() {
    this.updateInjectedWeb3State();
    this.stopUpdatingInjectedWeb3State = setInterval(this.updateInjectedWeb3State, 1000);
  }

  @action.bound
  async updateTokenDetails() {
    const [decimals, symbol, name, balance, approval] = await Promise.all([
      this.erc20.decimals(this.injectedWeb3, this.token),
      this.erc20.symbol(this.injectedWeb3, this.token),
      this.erc20.name(this.injectedWeb3, this.token),
      this.erc20.balance(this.injectedWeb3, this.token),
      this.erc20.approval(this.injectedWeb3, this.token),
    ]);
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
    this.balance = balance;
    this.approval = approval;
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
}

describe('Web3Store', () => {
  const erc20 = {};
  const isListening = jest.fn().mockReturnValue(Promise.resolve(true));
  const getId = jest.fn().mockReturnValue(Promise.resolve(1));
  const getAccounts = jest.fn().mockReturnValue(Promise.resolve(['abc']));
  const injectedWeb3 = {
    eth: {
      net: {
        isListening,
        getId,
      },
      getAccounts,
    },
    currentProvider: true,
  };

  test('sets initial asset', () => {
    const web3Store = new Web3Store(injectedWeb3, erc20, { asset: 'ethereum' });
    expect(web3Store.asset).toBe('ethereum');
  });

  test('computes ethereum network', () => {
    const web3Store = new Web3Store(injectedWeb3, erc20, { asset: 'ethereum' });
    expect(web3Store.network).toBe('ethereum');
  });

  test('computes other network', () => {
    const web3Store = new Web3Store(injectedWeb3, erc20, { asset: 'rinkeby' });
    expect(web3Store.network).toBe('rinkeby');
  });

  test('computes network when asset is token', () => {
    const web3Store = new Web3Store(injectedWeb3, erc20, { asset: 'ethereum:0x0' });
    expect(web3Store.network).toBe('ethereum');
  });

  test('computes token when asset is token', () => {
    const web3Store = new Web3Store(injectedWeb3, erc20, { asset: 'ethereum:0x0' });
    expect(web3Store.token).toBe('0x0');
  });

  test('sets token to undefined when asset is not token', () => {
    const web3Store = new Web3Store(injectedWeb3, erc20, { asset: 'ethereum' });
    expect(web3Store.token).toBe(undefined);
  });

  test('activeNetwork is undefined when currentProvider is false', () => {
    const web3Store = new Web3Store(injectedWeb3, erc20, {
      asset: 'ethereum',
      currentProvider: false,
    });
    expect(web3Store.activeNetwork).toBe(undefined);
  });

  test('activeNetwork is undefined when currentProvider is true but is not listening', () => {
    const web3Store = new Web3Store(injectedWeb3, erc20, {
      asset: 'ethereum',
      currentProvider: true,
      isListening: false,
    });
    expect(web3Store.activeNetwork).toBe(undefined);
  });

  test('activeNetwork is correct when currentProvider is true and is listening', () => {
    const web3Store = new Web3Store(injectedWeb3, erc20, {
      asset: 'ethereum',
      currentProvider: true,
      isListening: true,
      injectedWeb3ActiveNetwork: 'ethereum',
    });
    expect(web3Store.activeNetwork).toBe('ethereum');
  });

  test('#updateInjectedWeb3State correctly updates state', async () => {
    const isListening = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve(false))
      .mockReturnValueOnce(Promise.resolve(true));
    const getId = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve(0))
      .mockReturnValueOnce(Promise.resolve(1));
    const getAccounts = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve([]))
      .mockReturnValueOnce(Promise.resolve(['abc']));
    const injectedWeb3 = { eth: { net: { isListening, getId }, getAccounts }, currentProvider: false };
    const web3Store = new Web3Store(injectedWeb3, erc20, { asset: 'ethereum' });
    injectedWeb3.currentProvider = true;
    await web3Store.updateInjectedWeb3State();
    expect(web3Store.currentProvider).toBe(true);
    expect(web3Store.isListening).toBe(true);
    expect(web3Store.injectedWeb3ActiveNetwork).toBe('ethereum');
    expect(web3Store.currentAccount).toBe('abc');
  });

  test('updates data from injectedWeb3 every second', () => {
    jest.useFakeTimers();
    const web3Store = new Web3Store(injectedWeb3, erc20, { asset: 'ethereum' });
    expect(setInterval).toHaveBeenCalledWith(web3Store.updateInjectedWeb3State, 1000);
  });

  test('#updateTokenDetails correctly updates state', async () => {
    const isListening = jest.fn().mockReturnValue(Promise.resolve(true));
    const getId = jest.fn().mockReturnValue(Promise.resolve(1));
    const getAccounts = jest.fn().mockReturnValue(Promise.resolve(['abc']));
    const injectedWeb3 = { eth: { net: { isListening, getId }, getAccounts }, currentProvider: true };
    const decimals = jest.fn().mockReturnValue(Promise.resolve(18));
    const symbol = jest.fn().mockReturnValue(Promise.resolve('PRC'));
    const name = jest.fn().mockReturnValue(Promise.resolve('Procent'));
    const balance = jest.fn().mockReturnValue(Promise.resolve('1000000'));
    const approval = jest.fn().mockReturnValue(Promise.resolve('100'));
    const erc20 = { decimals, symbol, name, balance, approval };
    const web3Store = new Web3Store(injectedWeb3, erc20, { asset: 'ethereum' });
    await web3Store.updateTokenDetails();
    expect(web3Store.decimals).toBe(18);
    expect(web3Store.symbol).toBe('PRC');
    expect(web3Store.name).toBe('Procent');
    expect(web3Store.balance).toBe('1000000');
    expect(web3Store.approval).toBe('100');
  });
});
