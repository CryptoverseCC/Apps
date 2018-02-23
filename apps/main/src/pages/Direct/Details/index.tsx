import React, { Component } from 'react';

import { Details as DetailsComponent, Header, Lists } from '@linkexchange/new-details';
import { AddLinkWithInjectedWeb3AndTokenDetails } from '@linkexchange/add-link';
import { WidgetSettings, withWidgetSettings } from '@linkexchange/widget-settings';

import Modal from '@linkexchange/components/src/Modal';
import Status from '@linkexchange/status';

import * as style from './details.scss';

interface IProps {
  widgetSettings: WidgetSettings;
}

interface IState {
  isModalOpen: boolean;
}

class Details extends Component<IProps, IState> {
  state = {
    isModalOpen: false,
  };

  render() {
    const { widgetSettings } = this.props;
    const { isModalOpen } = this.state;

    return (
      <div className={style.self}>
        <DetailsComponent standaloneMode className={style.details}>
          <Header onAddClick={this._onAddLink} />
          {/* <Lists /> */}
        </DetailsComponent>
        <Modal isOpen={isModalOpen} onCloseRequest={this._closeModal}>
          <AddLinkWithInjectedWeb3AndTokenDetails
            loadBalance
            asset={widgetSettings.asset}
            openWidgetDetails={this._closeModal}
          />
        </Modal>
        <Status asset={widgetSettings.asset} />
      </div>
    );
  }

  _onAddLink = () => {
    this.setState({ isModalOpen: true });
  };

  _closeModal = () => {
    this.setState({ isModalOpen: false });
  };
}

export default withWidgetSettings(Details);
