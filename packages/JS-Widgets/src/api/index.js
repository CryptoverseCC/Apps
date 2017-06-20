
// ToDo unify with utils/ethereum after merge
const getContractAddress = () => {
  if (web3.version.network === '3') {
    return '0xa845c686a696c3d33988917c387d8ab939c66226';
  } else if (web3.version.network === '4') {
    return '0x0a48ac8263d9d79768d10cf9d7e82a19c49f0002';
  }

  throw new Error('Contract is unavailable on current network');
};

export function sendAdClaim(title, summary, target, address, value) {
  return new Promise((resolve) => {
    const claim = {
      type: ['Ad'],
      claim: { target, title, summary },
      credits: [{
        type: 'interface',
        value: window.location.href,
      }],
    };
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

    const contract = web3.eth.contract(abi).at(getContractAddress());

    contract.post(address, JSON.stringify(claim), { value: web3.toWei(value, 'ether') }, resolve);
  });
}
