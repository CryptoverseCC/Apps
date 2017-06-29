const { getCurrentNetworkName } = require('./utils');
const { abi, getContractAddress } = require('./utils/contract');

function sendClaim(address, claim, value) {
  return new Promise((resolve, reject) => {
    const contract = web3.eth.contract(abi)
      .at(getContractAddress(getCurrentNetworkName()));

    contract.post(
      address,
      JSON.stringify(claim),
      { value: web3.toWei(value, 'ether') },
      (errror) => {
        if (errror) {
          return reject(errror);
        }
        return resolve();
      },
    );
  });
}

function addAd(address, target, title, summary, value) {
  const claim = {
    type: ['ad'],
    claim: { target, title, summary },
    credits: [{
      type: 'interface',
      value: window.location.href,
    }],
  };

  return sendClaim(address, claim, value);
}

function whitelistAd(address, target) {
  const claim = {
    type: ['whitelist'],
    claim: { target },
    credits: [{
      type: 'interface',
      value: window.location.href,
    }],
  };

  return sendClaim(address, claim, 0);
}

module.exports = {
  addAd,
  whitelistAd,
};

