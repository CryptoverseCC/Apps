const withoutValueTransferContractAddressMapping = {
  ethereum: '0xFd74f0ce337fC692B8c124c094c1386A14ec7901',
  rinkeby: '0xC5De286677AC4f371dc791022218b1c13B72DbBd',
  ropsten: '0x6f32a6F579CFEed1FFfDc562231C957ECC894001',
  kovan: '0x139d658eD55b78e783DbE9bD4eb8F2b977b24153',
};

const valueTransferContractAddressMapping = {
  ethereum: '0x70B610F7072E742d4278eC55C02426Dbaaee388C',
  rinkeby: '0x00034B8397d9400117b4298548EAa59267953F8c',
  ropsten: '0x37C1CA7996CDdAaa31e13AA3eEE0C89Ee4f665B5',
  kovan: '0xc666c75C2bBA9AD8Df402138cE32265ac0EC7aaC',
};

const tokenTransferContractAddressMapping = {
  ethereum: '0xfF8A1BA752fE5df494B02D77525EC6Fa76cecb93',
  rinkeby: '0xBd2A0FF74dE98cFDDe4653c610E0E473137534fB',
  ropsten: '0x54b4372fA0bd76664B48625f0e8c899Ff19DFc39',
  kovan: '0xd6Ede7F43882B100C6311a9dF801088eA91cEb64',
};

export function getContractWithoutValueTransfer(web3Instance, networkName) {
  const contractAddress = withoutValueTransferContractAddressMapping[networkName];
  if (!contractAddress) {
    throw new Error('Contract is not available');
  }
  const contract = new web3Instance.eth.Contract(withoutValueTransferAbi, contractAddress);
  contract.setProvider(web3Instance.currentProvider); // ToDo because of bug in web3 1.0.0-beta26
  return contract;
}

const withoutValueTransferAbi = [
  {
    constant: false,
    inputs: [{ name: 'data', type: 'string' }],
    name: 'post',
    outputs: [],
    payable: false,
    type: 'function',
  },
];

export function getContractValueTransfer(web3Instance, networkName) {
  const contractAddress = valueTransferContractAddressMapping[networkName];
  if (!contractAddress) {
    throw new Error('Contract is not available');
  }
  const contract = new web3Instance.eth.Contract(valueTransferAbi, contractAddress);
  contract.setProvider(web3Instance.currentProvider); // ToDo because of bug in web3 1.0.0-beta26
  return contract;
}

const valueTransferAbi = [
  {
    constant: false,
    inputs: [{ name: 'userfeed', type: 'address' }, { name: 'data', type: 'string' }],
    name: 'post',
    outputs: [],
    payable: true,
    type: 'function',
  },
];

export function getContractTokenTransfer(web3Instance, networkName) {
  const contractAddress = tokenTransferContractAddressMapping[networkName];
  if (!contractAddress) {
    throw new Error('Contract is not available');
  }
  const contract = new web3Instance.eth.Contract(tokenTransferAbi, contractAddress);
  contract.setProvider(web3Instance.currentProvider); // ToDo because of bug in web3 1.0.0-beta26
  return contract;
}

export function getContractTokenTransferAddress(networkName) {
  const contractAddress = tokenTransferContractAddressMapping[networkName];
  if (!contractAddress) {
    throw new Error('Contract is not available');
  }
  return contractAddress;
}

const tokenTransferAbi = [
  {
    constant: false,
    inputs: [
      { name: 'userfeed', type: 'address' },
      { name: 'token', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'data', type: 'string' },
    ],
    name: 'post',
    outputs: [],
    payable: false,
    type: 'function',
  },
];

export function getErc20Contract(web3Instance, contractAddress) {
  const contract = new web3Instance.eth.Contract(erc20abi, contractAddress);
  contract.setProvider(web3Instance.currentProvider); // ToDo because of bug in web3 1.0.0-beta26
  return contract;
}

const erc20abi = [
  {
    constant: false,
    inputs: [{ name: '_spender', type: 'address' }, { name: '_value', type: 'uint256' }],
    name: 'approve',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }, { name: '_spender', type: 'address' }],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    type: 'function',
  },
];
