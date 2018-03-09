import Web3Store from './';
import { WidgetSettings } from '@linkexchange/widget-settings';
import { EWidgetSize } from '@linkexchange/types/widget';

describe('Web3Store', () => {
  let isListening;
  let getId;
  let getAccounts;
  let getBalance;
  let getBlockNumber;
  let getTransactionReceipt;
  let erc20GetTransactionReceipt;
  let injectedWeb3;
  let Erc20Mock;
  let asset;
  const createWidgetSettings = (asset) =>
    new WidgetSettings({
      apiUrl: '',
      recipientAddress: '',
      asset,
      algorithm: '',
      size: EWidgetSize.leaderboard,
      slots: 5,
      timeslot: 10,
    });
  beforeEach(() => {
    asset = '';
    isListening = jest.fn().mockReturnValue(Promise.resolve(true));
    getId = jest.fn().mockReturnValue(Promise.resolve(1));
    getAccounts = jest.fn().mockReturnValue(Promise.resolve(['abc']));
    getBalance = jest.fn().mockReturnValue(Promise.resolve('100000000'));
    getBlockNumber = jest.fn().mockReturnValue(Promise.resolve(123456));
    getTransactionReceipt = jest.fn().mockReturnValue(Promise.resolve({}));
    erc20GetTransactionReceipt = jest.fn().mockReturnValue(Promise.resolve({}));
    Erc20Mock = jest.fn().mockImplementation(() => ({
      decimals: jest.fn().mockReturnValue(Promise.resolve(18)),
      symbol: jest.fn().mockReturnValue(Promise.resolve('PRC')),
      name: jest.fn().mockReturnValue(Promise.resolve('Procent')),
      balance: jest.fn().mockReturnValue(Promise.resolve('1000000')),
      allowance: jest.fn().mockReturnValue(Promise.resolve('100')),
      currentBlock: jest.fn().mockReturnValue(Promise.resolve(123457)),
      transactionReceipt: erc20GetTransactionReceipt,
    }));
    injectedWeb3 = {
      eth: {
        net: {
          isListening,
          getId,
        },
        getAccounts,
        getBalance,
        getBlockNumber,
        getTransactionReceipt,
      },
      currentProvider: true,
    };
  });

  test('computes ethereum network', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'));
    expect(web3Store.network).toBe('ethereum');
  });

  test('computes other network', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('rinkeby'));
    expect(web3Store.network).toBe('rinkeby');
  });

  test('computes network when asset is token', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum:0x0'));
    expect(web3Store.network).toBe('ethereum');
  });

  test('computes token when asset is token', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum:0x0'));
    expect(web3Store.token).toBe('0x0');
  });

  test('sets token to undefined when asset is not token', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'));
    expect(web3Store.token).toBe(undefined);
  });

  test('activeNetwork is undefined when currentProvider is false', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'), {
      currentProvider: false,
    });
    expect(web3Store.activeNetwork).toBe(undefined);
  });

  test('activeNetwork is undefined when currentProvider is true but is not listening', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'), {
      currentProvider: true,
      isListening: false,
    });
    expect(web3Store.activeNetwork).toBe(undefined);
  });

  test('activeNetwork is correct when currentProvider is true and is listening', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'), {
      currentProvider: true,
      isListening: true,
      injectedWeb3ActiveNetwork: 'ethereum',
    });
    expect(web3Store.activeNetwork).toBe('ethereum');
  });

  test('computes token balanceWithDecimalPoint is undefined when balance is null', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'), {
      decimals: 10,
      balance: null,
    });
    expect(web3Store.balanceWithDecimalPoint).toBe(undefined);
  });

  test('computes token balanceWithDecimalPoint is undefined when balance is undefined', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'), {
      decimals: 10,
      balance: undefined,
    });
    expect(web3Store.balanceWithDecimalPoint).toBe(undefined);
  });

  test('computes token allowanceWithDecimalPoint correctly from wei', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'), {
      decimals: 10,
      allowance: '1000000000000',
    });
    expect(web3Store.allowanceWithDecimalPoint).toBe('100.000');
  });

  test('computes token allowanceWithDecimalPoint is undefined when balance is null', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'), {
      decimals: 10,
      allowance: null,
    });
    expect(web3Store.allowanceWithDecimalPoint).toBe(undefined);
  });

  test('computes token allowanceWithDecimalPoint is undefined when balance is undefined', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'), {
      decimals: 10,
      allowance: undefined,
    });
    expect(web3Store.allowanceWithDecimalPoint).toBe(undefined);
  });

  test('computes token allowanceWithDecimalPoint correctly from wei', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'), {
      decimals: 10,
      allowance: '100000000000',
    });
    expect(web3Store.allowanceWithDecimalPoint).toBe('10.000');
  });

  test('unlocked is false when is not ready', async () => {
    injectedWeb3.currentProvider = false;
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'));
    await web3Store.updateInjectedWeb3State();
    expect(web3Store.ready).toBe(false);
    expect(web3Store.unlocked).toBe(false);
  });

  test('unlocked is false when is ready but has no accounts', async () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'));
    getAccounts.mockReturnValue(Promise.resolve([]));
    await web3Store.updateInjectedWeb3State();
    expect(web3Store.ready).toBe(true);
    expect(web3Store.unlocked).toBe(false);
  });

  test('unlocked is true when is ready and has account', async () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'));
    await web3Store.updateInjectedWeb3State();
    expect(web3Store.ready).toBe(true);
    expect(web3Store.unlocked).toBe(true);
  });

  test('computes no provider reason correctly', async () => {
    injectedWeb3.currentProvider = false;
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'));
    await web3Store.updateInjectedWeb3State();
    expect(web3Store.reason).toBe('Install Metamask to unlock all the features');
  });

  test('computes no active account reason correctly', async () => {
    injectedWeb3.eth.getAccounts.mockReturnValue([]);
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'));
    await web3Store.updateInjectedWeb3State();
    expect(web3Store.reason).toBe('Unlock your wallet to unlock all the features');
  });

  test('computes different network reason correctly', async () => {
    injectedWeb3.eth.net.getId.mockReturnValue(2);
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'));
    await web3Store.updateInjectedWeb3State();
    expect(web3Store.reason).toBe('Switch to ethereum network to unlock all the features');
  });

  test('computes correct send claim method for ethereum', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'));
    const sendEthereumClaim = jest.fn();
    web3Store.sendEthereumClaim = sendEthereumClaim;
    expect(web3Store.sendClaim).toBe(sendEthereumClaim);
  });

  test('computes correct send claim method for token', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum:0x0'));
    const sendTokenClaim = jest.fn();
    web3Store.sendTokenClaim = sendTokenClaim;
    expect(web3Store.sendClaim).toBe(sendTokenClaim);
  });

  test('shouldApprove is false when asset is ethereum', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'));
    expect(web3Store.shouldApprove('10')).toBe(false);
  });

  test('shouldApprove is true when asset is token and allowance is lower than value', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum:0x0'), { allowance: '1' });
    expect(web3Store.shouldApprove('10')).toBe(true);
  });

  test('shouldApprove is false when asset is token and allowance is equal to value', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum:0x0'), { allowance: '10' });
    expect(web3Store.shouldApprove('10')).toBe(false);
  });

  test('shouldApprove is false when asset is token and allowance is higher than value', () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum:0x0'), { allowance: '10' });
    expect(web3Store.shouldApprove('10')).toBe(false);
  });

  test('#updateInjectedWeb3State correctly updates state', async () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'));
    await web3Store.updateInjectedWeb3State();
    expect(web3Store.currentProvider).toBe(true);
    expect(web3Store.isListening).toBe(true);
    expect(web3Store.injectedWeb3ActiveNetwork).toBe('ethereum');
    expect(web3Store.currentAccount).toBe('abc');
    expect(web3Store.blockNumber).toBe(123456);
  });

  test('#updateInjectedWeb3State correctly updates state when provider is falsy', async () => {
    injectedWeb3.currentProvider = false;
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'));
    await web3Store.updateInjectedWeb3State();
    expect(web3Store.currentProvider).toBe(false);
    expect(web3Store.isListening).toBe(undefined);
    expect(web3Store.injectedWeb3ActiveNetwork).toBe(undefined);
    expect(web3Store.currentAccount).toBe(undefined);
    expect(web3Store.blockNumber).toBe(123457);
  });

  test('updates data every second', () => {
    jest.useFakeTimers();
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'));
    expect((setInterval as jest.Mock).mock.calls).toEqual([
      [web3Store.updateInjectedWeb3State, 1000],
      [web3Store.updateTokenDetails, 5000],
    ]);
  });

  test('#updateTokenDetails correctly updates state when asset is not a token', async () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'));
    await web3Store.updateInjectedWeb3State();
    await web3Store.updateTokenDetails();
    expect(web3Store.decimals).toBe(18);
    expect(web3Store.symbol).toBe('ETH');
    expect(web3Store.name).toBe('ETH');
    expect(web3Store.balance).toBe('100000000');
    expect(web3Store.allowance).toBe(undefined);
  });

  test('#updateTokenDetails correctly updates state when asset is a token', async () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum:0x0'));
    await web3Store.updateInjectedWeb3State();
    await web3Store.updateTokenDetails();
    expect(web3Store.decimals).toBe(18);
    expect(web3Store.symbol).toBe('PRC');
    expect(web3Store.name).toBe('Procent');
    expect(web3Store.balance).toBe('1000000');
    expect(web3Store.allowance).toBe('100');
  });

  test('computes correct getTransactionReceipt method when not ready', async () => {
    injectedWeb3.currentProvider = false;
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'));
    await web3Store.updateInjectedWeb3State();
    expect(web3Store.getTransactionReceipt).toBe(erc20GetTransactionReceipt);
  });

  test('computes correct getTransactionReceipt method when ready', async () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('ethereum'));
    await web3Store.updateInjectedWeb3State();
    web3Store.transactionReceipt = getTransactionReceipt;
    expect(web3Store.getTransactionReceipt).toBe(getTransactionReceipt);
  });

  test('computes correct getTransactionReceipt method when ready but networks are different', async () => {
    const web3Store = new Web3Store(injectedWeb3, Erc20Mock, createWidgetSettings('rinkeby'));
    await web3Store.updateInjectedWeb3State();
    expect(web3Store.getTransactionReceipt).toBe(erc20GetTransactionReceipt);
  });
});
