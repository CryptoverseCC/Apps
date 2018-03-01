import Web3Store from './';

describe('Web3Store', () => {
  let isListening;
  let getId;
  let getAccounts;
  let getBalance;
  let injectedWeb3;
  let Erc20Mock;
  beforeEach(() => {
    isListening = jest.fn().mockReturnValue(Promise.resolve(true));
    getId = jest.fn().mockReturnValue(Promise.resolve(1));
    getAccounts = jest.fn().mockReturnValue(Promise.resolve(['abc']));
    getBalance = jest.fn().mockReturnValue(Promise.resolve('100000000'));
    Erc20Mock = jest.fn().mockImplementation(() => ({
      decimals: jest.fn().mockReturnValue(Promise.resolve(18)),
      symbol: jest.fn().mockReturnValue(Promise.resolve('PRC')),
      name: jest.fn().mockReturnValue(Promise.resolve('Procent')),
      balance: jest.fn().mockReturnValue(Promise.resolve('1000000')),
      approval: jest.fn().mockReturnValue(Promise.resolve('100')),
    }));
    injectedWeb3 = {
      eth: {
        net: {
          isListening,
          getId,
        },
        getAccounts,
        getBalance,
      },
      currentProvider: true,
    };
  });

  test('sets initial asset', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum' });
    expect(web3Store.asset).toBe('ethereum');
  });

  test('computes ethereum network', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum' });
    expect(web3Store.network).toBe('ethereum');
  });

  test('computes other network', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'rinkeby' });
    expect(web3Store.network).toBe('rinkeby');
  });

  test('computes network when asset is token', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum:0x0' });
    expect(web3Store.network).toBe('ethereum');
  });

  test('computes token when asset is token', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum:0x0' });
    expect(web3Store.token).toBe('0x0');
  });

  test('sets token to undefined when asset is not token', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum' });
    expect(web3Store.token).toBe(undefined);
  });

  test('activeNetwork is undefined when currentProvider is false', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, {
      asset: 'ethereum',
      currentProvider: false,
    });
    expect(web3Store.activeNetwork).toBe(undefined);
  });

  test('activeNetwork is undefined when currentProvider is true but is not listening', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, {
      asset: 'ethereum',
      currentProvider: true,
      isListening: false,
    });
    expect(web3Store.activeNetwork).toBe(undefined);
  });

  test('activeNetwork is correct when currentProvider is true and is listening', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, {
      asset: 'ethereum',
      currentProvider: true,
      isListening: true,
      injectedWeb3ActiveNetwork: 'ethereum',
    });
    expect(web3Store.activeNetwork).toBe('ethereum');
  });

  test('computes token balanceWithDecimalPoint is undefined when balance is null', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, {
      asset: 'ethereum',
      decimals: '10',
      balance: null,
    });
    expect(web3Store.balanceWithDecimalPoint).toBe(undefined);
  });

  test('computes token balanceWithDecimalPoint is undefined when balance is undefined', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, {
      asset: 'ethereum',
      decimals: '10',
      balance: undefined,
    });
    expect(web3Store.balanceWithDecimalPoint).toBe(undefined);
  });

  test('computes token balanceWithDecimalPoint correctly from wei', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, {
      asset: 'ethereum',
      decimals: '10',
      balance: '1000000000000',
    });
    expect(web3Store.balanceWithDecimalPoint).toBe('100.000');
  });

  test('computes no provider reason correctly', async () => {
    injectedWeb3.currentProvider = false;
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum' });
    await web3Store.updateInjectedWeb3State();
    expect(web3Store.reason).toBe('Enable Metamask to unlock all the features');
  });

  test('computes not listening reason correctly', async () => {
    injectedWeb3.eth.net.isListening.mockReturnValue(false);
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum' });
    await web3Store.updateInjectedWeb3State();
    expect(web3Store.reason).toBe('Enable Metamask to unlock all the features');
  });

  test('computes no active account reason correctly', async () => {
    injectedWeb3.eth.getAccounts.mockReturnValue([]);
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum' });
    await web3Store.updateInjectedWeb3State();
    expect(web3Store.reason).toBe('Unlock your wallet to unlock all the features');
  });

  test('computes different network reason correctly', async () => {
    injectedWeb3.eth.net.getId.mockReturnValue(2);
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum' });
    await web3Store.updateInjectedWeb3State();
    expect(web3Store.reason).toBe('Switch to ethereum network to unlock all the features');
  });

  test('computes correct send claim method for ethereum', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum' });
    const sendEthereumClaim = jest.fn();
    web3Store.sendEthereumClaim = sendEthereumClaim;
    expect(web3Store.sendClaim).toBe(sendEthereumClaim);
  });

  test('computes correct send claim method for token', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum:0x0' });
    const sendTokenClaim = jest.fn();
    web3Store.sendTokenClaim = sendTokenClaim;
    expect(web3Store.sendClaim).toBe(sendTokenClaim);
  });

  test('computes correct approve method for ethereum', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum' });
    const approveEthereum = jest.fn();
    web3Store.approveEthereum = approveEthereum;
    expect(web3Store.approve).toBe(approveEthereum);
  });

  test('computes correct approve method for token', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum:0x0' });
    const approveToken = jest.fn();
    web3Store.approveToken = approveToken;
    expect(web3Store.approve).toBe(approveToken);
  });

  test('#updateInjectedWeb3State correctly updates state', async () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum' });
    await web3Store.updateInjectedWeb3State();
    expect(web3Store.currentProvider).toBe(true);
    expect(web3Store.isListening).toBe(true);
    expect(web3Store.injectedWeb3ActiveNetwork).toBe('ethereum');
    expect(web3Store.currentAccount).toBe('abc');
  });

  test('updates data every second', () => {
    jest.useFakeTimers();
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum' });
    expect((setInterval as jest.Mock).mock.calls).toEqual([
      [web3Store.updateInjectedWeb3State, 1000],
      [web3Store.updateTokenDetails, 1000],
    ]);
  });

  test('#updateTokenDetails correctly updates state when asset is not a token', async () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum' });
    await web3Store.updateInjectedWeb3State();
    await web3Store.updateTokenDetails();
    expect(web3Store.decimals).toBe(18);
    expect(web3Store.symbol).toBe('ETH');
    expect(web3Store.name).toBe('ETH');
    expect(web3Store.balance).toBe('100000000');
  });

  test('#updateTokenDetails correctly updates state when asset is a token', async () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum:0x0' });
    await web3Store.updateInjectedWeb3State();
    await web3Store.updateTokenDetails();
    expect(web3Store.decimals).toBe(18);
    expect(web3Store.symbol).toBe('PRC');
    expect(web3Store.name).toBe('Procent');
    expect(web3Store.balance).toBe('1000000');
  });

  test('Erc20 is reconstructed after asset change', async () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, { asset: 'ethereum:0x0' });
    await web3Store.updateInjectedWeb3State();
    await web3Store.updateTokenDetails();
    web3Store.asset = 'rinkeby:0x0';
    await web3Store.updateTokenDetails();
    expect(Erc20Mock).toHaveBeenCalledTimes(2);
  });
});
