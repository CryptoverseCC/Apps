import { h, Component } from 'preact';

import './menu.css';
import Button from './components/button';
import AddAdModal from './addAdModal';

export default class Menu extends Component {

  static defaultProps = {
    web3Available: !!window.web3,
  };

  render({ web3Available }, { isOpen, isModalOpen, posting }) {
    return (
      <div>
        <Button class="button" onClick={this._onMenuClick}>...</Button>
        { isOpen && <div class="menu">
            { web3Available
                ? (<div class="menu-item" onClick={this._onAddClick}>
                  <i class="plus" /> Create New Ad
                </div>)
                : <div class="menu-item">web3 unavailable :-(</div>
            }
          </div>
        }
        <AddAdModal
          isOpen={isModalOpen}
          onCloseRequest={this._onModalCloseRequest}
          onFinish={this._onModalCloseRequest}
        />
      </div>
    );
  }

  _onMenuClick = () => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  _onAddClick = () => {
    this.setState({ isModalOpen: true, isOpen: false });
  };

  _onModalCloseRequest = () => {
    this.setState({ isModalOpen: false });
  };
}
