import { h, Component } from 'preact';

import './menu.css';

import If from './components/utils/if';
import Switch from './components/utils/switch';

import Plus from './components/plus';
import Button from './components/button';

import AddAdModal from './addAdModal';
import WidgetDetailsModal from './widgetDetailsModal';

export default class Menu extends Component {

  state = {
    web3Available: !!window.web3,
  };

  render({ context, algorithm, ads },
    { isOpen, isAddAdModalOpen, isWidgetDetailsModalOpen, web3Available }) {

    return (
      <div>
        <Button class="button" onClick={this._onMenuClick}>...</Button>
        <If condition={isOpen}>
          <div class="menu">
            <div class="menu-item" onClick={this._onAddAdClick}>
              <Switch expresion={web3Available}>
                <Switch.Case condition={true}>
                  <Plus /> Create New Ad
                </Switch.Case>
                <Switch.Case condition={false}>
                  web3 unavailable :-(
                </Switch.Case>
              </Switch>
            </div>
            <hr />
            <div class="menu-item" onClick={this._onDetailsClick}>Widget Details</div>
          </div>
        </If>
        <AddAdModal
          context={context}
          isOpen={isAddAdModalOpen}
          onCloseRequest={this._onAddAdModalCloseRequest}
          onFinish={this._onAddAdModalCloseRequest}
        />
        <WidgetDetailsModal
          ads={ads}
          context={context}
          algorithm={algorithm}
          isOpen={isWidgetDetailsModalOpen}
          onCloseRequest={this._onWidgeDetailsModalCloseRequest}
        />
      </div>
    );
  }

  _onMenuClick = () => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  _onAddAdClick = () => {
    if (this.state.web3Available) {
      this.setState({ isAddAdModalOpen: true, isOpen: false });
    }
  };

  _onDetailsClick = () => {
    this.setState({ isWidgetDetailsModalOpen: true, isOpen: false });
  };

  _onAddAdModalCloseRequest = () => {
    this.setState({ isAddAdModalOpen: false });
  };

  _onWidgeDetailsModalCloseRequest = () => {
    this.setState({ isWidgetDetailsModalOpen: false });
  };
}
