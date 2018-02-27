import { extendObservable, computed } from 'mobx';
class Web3Store {
  asset: string;
  constructor(initialState) {
    extendObservable(this, initialState);
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
  test('sets asset', () => {
    const web3Store = new Web3Store({ asset: 'ethereum' });
    expect(web3Store.asset).toBe('ethereum');
  });
  test('correctly computes ethereum network', () => {
    const web3Store = new Web3Store({ asset: 'ethereum' });
    expect(web3Store.network).toBe('ethereum');
  });
  test('correctly computes other network', () => {
    const web3Store = new Web3Store({ asset: 'rinkeby' });
    expect(web3Store.network).toBe('rinkeby');
  });
  test('correctly computes network when asset is token', () => {
    const web3Store = new Web3Store({ asset: 'ethereum:0x0' });
    expect(web3Store.network).toBe('ethereum');
  });
  test('correctly computes token when asset is token', () => {
    const web3Store = new Web3Store({ asset: 'ethereum:0x0' });
    expect(web3Store.token).toBe('0x0');
  });
});
