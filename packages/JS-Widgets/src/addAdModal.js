import { h, Component } from 'preact';
import linkState from 'linkstate';

import './addAdModal.css';
import Modal from './components/modal';
import Input from './components/input';
import Loader from './components/loader';
import Button from './components/button';

export default class AddAdModal extends Component {

  render({ isOpen, onCloseRequest }, { posting }) {
    return (
      <Modal isOpen={isOpen} onCloseRequest={onCloseRequest}>
        <Input placeholder="Userfeeds ID" onInput={linkState(this, 'address')} />
        <Input placeholder="Title" onInput={linkState(this, 'title')} />
        <Input placeholder="Summary" onInput={linkState(this, 'summary')} />
        <Input placeholder="URL" onInput={linkState(this, 'url')} />
        <Input placeholder="Value" onInput={linkState(this, 'value')} />
        <div class="send-button">
          { posting
              ? <Loader />
              : <Button onClick={this._onSubmit}>Send</Button>
          }
        </div>
      </Modal>
    );
  }

  _onSubmit = () => {
    const { title, summary, url: target, address, value } = this.state;
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

    const contractAddress = '0x0a48ac8263d9d79768d10cf9d7e82a19c49f0002';
    const contract = web3.eth.contract(abi).at(contractAddress);

    this.setState({ posting: true });
    contract.post(address, JSON.stringify(claim), { value: web3.toWei(value, 'ether') }, () => {
      this.setState({ posting: false });
      this.props.onFinish();
    });
  };
}
