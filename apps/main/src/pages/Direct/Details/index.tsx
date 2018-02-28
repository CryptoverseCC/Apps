import React, { Component } from 'react';
import moment from 'moment';

import { Details as DetailsComponent, Header, Lists, AddLinkButton, Expires } from '@linkexchange/new-details';
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
        <DetailsComponent>
          <Header
            addLink={<AddLinkButton onClick={this.onAddLink} />}
            expires={<Expires in={this.getDurationToExpires()} />}
          />
          <Lists />
        </DetailsComponent>
        <Modal isOpen={isModalOpen} onCloseRequest={this.closeModal}>
          <AddLinkWithInjectedWeb3AndTokenDetails
            loadBalance
            asset={widgetSettings.asset}
            openWidgetDetails={this.closeModal}
          />
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
