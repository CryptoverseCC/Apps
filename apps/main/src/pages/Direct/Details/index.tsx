import React, { Component } from 'react';
import moment from 'moment';

import { Details as DetailsComponent, Header, Lists, AddLinkButton, Expires } from '@linkexchange/new-details';
import { AddLinkWithInjectedWeb3AndTokenDetails } from '@linkexchange/add-link';
import { WidgetSettings, withWidgetSettings } from '@linkexchange/widget-settings';
import web3 from '@linkexchange/utils/web3';
import Web3Store from '@linkexchange/web3-store';
import Erc20 from '@linkexchange/web3-store/erc20';

import Modal from '@linkexchange/components/src/Modal';
import Status from '@linkexchange/status';
import AddLink from '@linkexchange/new-add-link';

import * as style from './details.scss';
import { Provider } from 'mobx-react';

interface IProps {
  widgetSettings: WidgetSettings;
}

interface IState {
  isModalOpen: boolean;
}

class Details extends Component<IProps, IState> {
  web3Store: Web3Store;

  state = {
    isModalOpen: false,
  };

  constructor(props) {
    super(props);
    const [network] = this.props.widgetSettings.asset.split(':');
    this.web3Store = new Web3Store(web3, Erc20, { asset: this.props.widgetSettings.asset });
  }

  componentWillUnmount() {
    this.web3Store.stopUpdating();
  }

  render() {
    const { widgetSettings } = this.props;
    const { isModalOpen } = this.state;

    return (
      <div className={style.self}>
        <DetailsComponent className={style.details}>
          <Header
            addLink={<AddLinkButton onClick={this.onAddLink} />}
            expires={<Expires in={this.getDurationToExpires()} />}
          />
          <Lists addLink={<AddLinkButton onClick={this.onAddLink} />} />
        </DetailsComponent>
        <Modal isOpen={isModalOpen} onCloseRequest={this.closeModal}>
          <Provider
            web3Store={this.web3Store}
            widgetSettingsStore={this.props.widgetSettings}
            formValidationsStore={{ 'add-link': {} }}
          >
            <div style={{ width: '500px' }}>
              <AddLink />
            </div>
          </Provider>
        </Modal>
        <Status asset={widgetSettings.asset} />
      </div>
    );
  }

  private onAddLink = () => {
    this.setState({ isModalOpen: true });
  };

  private closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  private getDurationToExpires = () => {
    return moment(this.props.widgetSettings.tillDate, 'MM/DD/YYYY').diff(moment());
  };
}

export default withWidgetSettings(Details);
