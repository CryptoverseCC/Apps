import React, { Component } from 'react';
import moment from 'moment';

import { Details as DetailsComponent, Header, Lists, AddLinkButton, Expires } from '@linkexchange/new-details';
import Modal from '@linkexchange/components/src/Modal';
import Status from '@linkexchange/status';
import AddLink from '@linkexchange/new-add-link';

import * as style from './details.scss';
import { inject, observer } from 'mobx-react';
import { IWidgetSettings } from '@linkexchange/types/widget';

interface IProps {
  widgetSettingsStore: IWidgetSettings;
}

interface IState {
  isModalOpen: boolean;
}

@inject('widgetSettingsStore')
@observer
export default class Details extends Component<IProps, IState> {
  state = {
    isModalOpen: false,
  };

  private onAddLink = () => {
    this.setState({ isModalOpen: true });
  };

  private closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  private getDurationToExpires = () => {
    return moment(this.props.widgetSettingsStore!.tillDate, 'MM/DD/YYYY').diff(moment());
  };

  render() {
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
          <div style={{ width: '500px', backgroundColor: 'white' }}>
            <AddLink />
          </div>
        </Modal>
        <Status />
      </div>
    );
  }
}
