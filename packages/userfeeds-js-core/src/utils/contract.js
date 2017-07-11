
const payableContractAddressMapping = {
  ropsten: '0xa845c686a696c3d33988917c387d8ab939c66226',
  rinkeby: '0x0a48ac8263d9d79768d10cf9d7e82a19c49f0002',
};

const notpayableContractAddressMapping = {
  ropsten: '0x5c3fe6b94b57c1e294000403340f12f083e71b83',
  rinkeby: '0x09dcdf34e0c28b106fdfe51009cb71ae92bf8bbc',
};

function getContractAddress(networkName, payable = true) {
  let contract;
  if (payable) {
    contract = payableContractAddressMapping[networkName];
  } else {
    contract = notpayableContractAddressMapping[networkName];
  }

  if (!contract) {
    throw new Error('Contract is not available');
  }

  return contract;
}

const payableAbi = [{
  constant: false,
  inputs: [
    { name: 'userfeed', type: 'address' },
    { name: 'data', type: 'string' },
  ],
  name: 'post',
  outputs: [],
  payable: true,
  type: 'function',
}, {
  anonymous: false,
  inputs: [
    { name: 'sender', type: 'address', indexed: false },
    { name: 'userfeed', type: 'address', indexed: false },
    { name: 'data', type: 'string', indexed: false },
  ],
  name: 'Claim',
  type: 'event',
}];

const notpayableAbi = [{
  constant: false,
  inputs: [
    { name: 'data', type: 'string' },
  ],
  name: 'post',
  outputs: [],
  payable: false,
  type: 'function',
}, {
  anonymous: false,
  inputs: [
    { name: 'sender', type: 'address', indexed: false },
    { name: 'data', type: 'string', indexed: false },
  ],
  name: 'Claim',
  type: 'event'
}];

module.exports = {
  payableAbi,
  notpayableAbi,
  getContractAddress,
};
