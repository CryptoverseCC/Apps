import { observable, extendObservable, computed, observe, action } from 'mobx';
import { networkMapping } from '@userfeeds/core/src/utils';
class Web3Store {
  asset: string;
  @observable activeNetwork: string = undefined;
  constructor(private injectedWeb3, initialState) {
    extendObservable(this, initialState);
    this.updateInjectedWeb3State();
  }

  @action
  async updateInjectedWeb3State() {
    this.activeNetwork = networkMapping[await this.injectedWeb3.eth.net.getId()];
  }

  ready = () =>
    new Promise((resolve) => {
      resolve();
    });

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
  const injectedWeb3 = {
    eth: {
      net: {
        isListening: jest.fn().mockReturnValue(Promise.resolve(true)),
        getId: jest.fn().mockReturnValue(Promise.resolve(1)),
      },
    },
    currentProvider: null,
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
  test('exposes activeNetwork', async () => {
    const web3Store = new Web3Store(injectedWeb3, { asset: 'ethereum' });
    await web3Store.ready();
    expect(web3Store.activeNetwork).toBe('ethereum');
  });
});
