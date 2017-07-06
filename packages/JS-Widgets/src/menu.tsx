import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { returntypeof } from 'react-redux-typescript';

import { IRootState } from './reducers';
import { modalActions } from './actions/modal';

import If from './components/utils/if';
import Switch from './components/utils/switch';

import Plus from './components/plus';
import Button from './components/button';

import { openUserfeedsUrl } from './utils/openUserfeedsUrl';

import * as style from  './menu.scss';

interface IMenuState {
  isOpen: boolean;
  web3Available: boolean;
}

const mapStateToProps = ({ widget }: IRootState) => ({
  ...widget,
});

const mapDispatchToProps = (dispatch) => ({
  openAddLink: () => dispatch(modalActions.open({ modalName: 'addLink' })),
  openWidgetDetails: () => dispatch(modalActions.open({ modalName: 'widgetDetails' })),
});

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);
type IMenuProps = typeof State2Props & typeof Dispatch2Props;

@connect(mapStateToProps, mapDispatchToProps)
export default class Menu extends Component<IMenuProps, IMenuState> {

  state = {
    isOpen: false,
    web3Available: !!web3,
  };

  render(_, { isOpen, web3Available }: IMenuState) {

    return (
      <div class={style.self}>
        <Button onClick={this._onMenuClick}>...</Button>
        <If condition={isOpen}>
          <div class={style.menu}>
            <div class={style.menuItem} onClick={this._onAddLinkClick}>
              <Switch expresion={web3Available}>
                <Switch.Case condition={true}>
                  <Plus /> Create New Link
                </Switch.Case>
                <Switch.Case condition={false}>
                  web3 unavailable :-(
                </Switch.Case>
              </Switch>
            </div>
            <If condition={web3Available}>
              <hr />
              <div class={style.menuItem} onClick={this._onWhitelistClick}>
                Whitelist
              </div>
            </If>
            <hr />
            <div class={style.menuItem} onClick={this._onDetailsClick}>Widget Details</div>
          </div>
        </If>
      </div>
    );
  }

  _onMenuClick = () => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  _onWhitelistClick = () => {
    this.setState({ isOpen: false });
    window.alert('Please change your current network and address to ' + this.props.whitelist);
  };

  _onAddLinkClick = () => {
    if (this.state.web3Available) {
      this.setState({ isOpen: false });
      this.props.openAddLink();
    }
  };

  _onDetailsClick = () => {
    this.setState({ isOpen: false });
    this.props.openWidgetDetails();
  };
}
