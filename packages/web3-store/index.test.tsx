import { extendObservable, computed } from 'mobx';
class Web3Store {
  asset: string;
  constructor(initialState) {
    extendObservable(this, initialState);
  }
  @computed
  get network() {
    return this.asset;
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
});
