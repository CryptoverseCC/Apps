import { observable, extendObservable, computed, observe, action } from 'mobx';
import { networkMapping } from '@userfeeds/core/src/utils';
class Web3Store {
  stopUpdatingInjectedWeb3State: any;

  currentProvider: any;
  isListening: boolean;
  injectedWeb3ActiveNetwork: string;

  asset: string;

  constructor(private injectedWeb3, initialState) {
    extendObservable(this, initialState);
    this.startUpdatingInjectedWeb3State();
  }

  startUpdatingInjectedWeb3State() {
    this.updateInjectedWeb3State();
    this.stopUpdatingInjectedWeb3State = setInterval(this.updateInjectedWeb3State, 1000);
  }

  @action.bound
  async updateInjectedWeb3State() {
    this.currentProvider = this.injectedWeb3.currentProvider;
    const [isListening, networkId] = await Promise.all([
      this.injectedWeb3.eth.net.isListening(),
      this.injectedWeb3.eth.net.getId(),
    ]);
    this.isListening = isListening;
    this.injectedWeb3ActiveNetwork = networkMapping[networkId];
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
  const isListening = jest.fn().mockReturnValue(Promise.resolve(true));
  const getId = jest.fn().mockReturnValue(Promise.resolve(1));
  const injectedWeb3 = {
    eth: {
      net: {
        isListening,
        getId,
      },
    },
    currentProvider: true,
  };

  test('sets initial asset', () => {
    const web3Store = new Web3Store(injectedWeb3, { asset: 'ethereum' });
    expect(web3Store.asset).toBe('ethereum');
  });

  test('computes ethereum network', () => {
    const web3Store = new Web3Store(injectedWeb3, { asset: 'ethereum' });
    expect(web3Store.network).toBe('ethereum');
  });

  test('computes other network', () => {
    const web3Store = new Web3Store(injectedWeb3, { asset: 'rinkeby' });
    expect(web3Store.network).toBe('rinkeby');
  });

  test('computes network when asset is token', () => {
    const web3Store = new Web3Store(injectedWeb3, { asset: 'ethereum:0x0' });
    expect(web3Store.network).toBe('ethereum');
  });

  test('computes token when asset is token', () => {
    const web3Store = new Web3Store(injectedWeb3, { asset: 'ethereum:0x0' });
    expect(web3Store.token).toBe('0x0');
  });

  test('sets token to undefined when asset is not token', () => {
    const web3Store = new Web3Store(injectedWeb3, { asset: 'ethereum' });
    expect(web3Store.token).toBe(undefined);
  });

  test('activeNetwork is undefined when currentProvider is false', () => {
    const web3Store = new Web3Store(injectedWeb3, {
      asset: 'ethereum',
      currentProvider: false,
    });
    expect(web3Store.activeNetwork).toBe(undefined);
  });

  test('activeNetwork is undefined when currentProvider is true but is not listening', () => {
    const web3Store = new Web3Store(injectedWeb3, {
      asset: 'ethereum',
      currentProvider: true,
      isListening: false,
    });
    expect(web3Store.activeNetwork).toBe(undefined);
  });

  test('activeNetwork is correct when currentProvider is true and is listening', () => {
    const web3Store = new Web3Store(injectedWeb3, {
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
      .mockReturnValueOnce(Promise.resolve(true))
      .mockReturnValueOnce(Promise.resolve(false));
    const getId = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve(1))
      .mockReturnValueOnce(Promise.resolve(0));
    const injectedWeb3 = { eth: { net: { isListening, getId } }, currentProvider: true };
    const web3Store = new Web3Store(injectedWeb3, { asset: 'ethereum' });
    injectedWeb3.currentProvider = false;
    await web3Store.updateInjectedWeb3State();
    expect(web3Store.currentProvider).toBe(false);
    expect(web3Store.isListening).toBe(false);
    expect(web3Store.injectedWeb3ActiveNetwork).toBe(undefined);
  });

  test('updates data from injectedWeb3 every second', () => {
    jest.useFakeTimers();
    const web3Store = new Web3Store(injectedWeb3, {
      asset: 'ethereum',
      currentProvider: true,
      isListening: true,
      injectedWeb3ActiveNetwork: 'ethereum',
    });
    expect(setInterval).toHaveBeenCalledWith(web3Store.updateInjectedWeb3State, 1000);
  });
});
