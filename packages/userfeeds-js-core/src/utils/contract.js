
const contractAddressMapping = {
  ropsten: '0xa845c686a696c3d33988917c387d8ab939c66226',
  rinkeby: '0x0a48ac8263d9d79768d10cf9d7e82a19c49f0002',
};

function getContractAddress(networkName) {
  const contract = contractAddressMapping[networkName];

  if (!contract) {
    throw new Error('Contract is not available');
  }

  return contract;
}

const abi = [{
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
    { indexed: false, name: 'sender', type: 'address' },
    { indexed: false, name: 'userfeed', type: 'address' },
    { indexed: false, name: 'data', type: 'string' },
  ],
  name: 'Claim',
  type: 'event',
}];

module.exports = {
  abi,
  getContractAddress,
};
