import { h, Component } from 'preact';

import style from './menu.scss';

import If from './components/utils/if';
import Switch from './components/utils/switch';

import Plus from './components/plus';
import Button from './components/button';

import AddAdModal from './addAdModal';
import WidgetDetailsModal from './widgetDetailsModal';

import { checkNetwork, checkCurrentAccount } from './utils/ethereum';
import { openUserfeedsUrl } from './utils/openUserfeedsUrl';

export default class Menu extends Component {

  state = {
    web3Available: !!window.web3,
  };

  render({ context, algorithm, whitelist, ads },
    { isOpen, isAddAdModalOpen, isWidgetDetailsModalOpen, web3Available }) {

    return (
      <div class={style.this}>
        <Button onClick={this._onMenuClick}>...</Button>
        <If condition={isOpen}>
          <div class={style.menu}>
            <div class={style.menuItem} onClick={this._onAddAdClick}>
              <Switch expresion={web3Available}>
                <Switch.Case condition={true}>
                  <Plus /> Create New Ad
                </Switch.Case>
                <Switch.Case condition={false}>
                  web3 unavailable :-(
                </Switch.Case>
              </Switch>
            </div>
            <If condition={web3Available && whitelist}>
              <hr />
              <div class={style.menuItem} onClick={this._onWhitelistClick}>
                Whitelist
              </div>
            </If>
            <hr />
            <div class={style.menuItem} onClick={this._onDetailsClick}>Widget Details</div>
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
          whitelist={whitelist}
          isOpen={isWidgetDetailsModalOpen}
          web3Available={web3Available}
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

  _onWhitelistClick = () => {
    this.setState({ isOpen: false });
    const [network, account] = this.props.whitelist.split(':');
    if (checkNetwork(network) && checkCurrentAccount(account)) {
      openUserfeedsUrl('apps/links/#/whitelist/', this.props);
    } else {
      window.alert('Please change your current network and address to ' + this.props.whitelist);
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
