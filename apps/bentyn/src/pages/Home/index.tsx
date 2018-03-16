import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import AddLink from '@linkexchange/new-add-link';
import Modal from '@linkexchange/components/src/Modal';
import { Details, Header, Lists } from '@linkexchange/new-details';
import { WidgetSettings } from '@linkexchange/widget-settings';
import Tooltip from '@linkexchange/components/src/Tooltip';
import Button from '@linkexchange/components/src/NewButton';
import Switch from '@linkexchange/components/src/utils/Switch';
import BlocksTillConclusion from '@linkexchange/blocks-till-conclusion';
import BlocksTillConclusionProvider from '@linkexchange/blocks-till-conclusion-provider';
import Status from '@linkexchange/status';

import Welcome from './components/Welcome';
import HowToBuy from './components/HowToBuy';
import BoostLink from './components/BoostLink';
import AddLinkButton from './components/AddLink';
import DashBoardLink from './components/DashboardLink';
import BlocksStore from '../../stores/blocks';

import * as style from './home.scss';

interface IProps {
  blocks?: BlocksStore;
  widgetSettingsStore?: WidgetSettings;
}

interface IState {
  openedModal: 'none' | 'Welcome' | 'HowToBuy' | 'AddLink';
}

class Home extends Component<IProps, IState> {
  state: IState = {
    openedModal: 'Welcome',
  };

  render() {
    const { widgetSettingsStore, blocks } = this.props;
    const { openedModal } = this.state;

    return (
      <div className={style.self}>
        <Details className={style.details}>
          <Header
            expires={<BlocksTillConclusion startBlock={blocks!.startBlock} endBlock={blocks!.endBlock} />}
            addLink={
              <>
                <AddLinkButton onClick={this.addLink} />
                <DashBoardLink />
              </>
            }
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
            <Switch.Case condition="HowToBuy">
              <HowToBuy gotBens={this.closeModal} />
            </Switch.Case>
            <Switch.Case condition="Welcome">
              <Welcome
                startBlock={blocks!.startBlock}
                endBlock={blocks!.endBlock}
                asset={widgetSettingsStore!.asset}
                purchaseBens={this.purchaseBens}
                gotBens={this.closeModal}
              />
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

  private purchaseBens = () => {
    this.setState({ openedModal: 'HowToBuy' });
  };
}

export default inject('blocks', 'widgetSettingsStore')(observer(Home));
