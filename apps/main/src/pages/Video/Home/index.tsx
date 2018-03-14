import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import AddLink from '@linkexchange/new-add-link';
import Modal from '@linkexchange/components/src/Modal';
import { WidgetSettings } from '@linkexchange/widget-settings';
import { Details, Header, Lists } from '@linkexchange/new-details';
import Switch from '@linkexchange/components/src/utils/Switch';
import BlocksTillConclusion from '@linkexchange/blocks-till-conclusion';
import Status from '@linkexchange/status';

import AddLinkButton from './components/AddLink';
import BoostLink from './components/BoostLink';
import BlocksStore from '../../../stores/blocks';

import * as style from './home.scss';

interface IProps {
  blocks: BlocksStore;
  widgetSettingsStore: WidgetSettings;
}

interface IState {
  openedModal: 'none' | 'AddLink';
}

class Home extends Component<IProps, IState> {
  state: IState = {
    openedModal: 'none',
  };

  render() {
    const { widgetSettingsStore, blocks } = this.props;
    const { openedModal } = this.state;

    // ToDo add dashboard button
    return (
      <div className={style.self}>
        <Details className={style.details}>
          <Header
            expires={
              <BlocksTillConclusion
                startBlock={blocks.startBlock}
                endBlock={blocks.endBlock}
                className={style.blocksTillConclusion}
              />
            }
            addLink={<AddLinkButton onClick={this.addLink} />}
          />
          <Lists boostComponent={BoostLink} addLink={<AddLinkButton onClick={this.addLink} />} />
        </Details>
        <Modal isOpen={openedModal !== 'none'} onCloseRequest={this.closeModal}>
          <Switch expresion={this.state.openedModal}>
            <Switch.Case condition="AddLink">
              <div style={{ width: '500px', backgroundColor: 'white' }}>
                <AddLink />
              </div>
            </Switch.Case>
          </Switch>
        </Modal>
        <Status />
      </div>
    );
  }

  private addLink = () => {
    this.setState({ openedModal: 'AddLink' });
  };

  private closeModal = () => {
    this.setState({ openedModal: 'none' });
  };
}

export default inject('widgetSettingsStore', 'blocks')(observer(Home));
