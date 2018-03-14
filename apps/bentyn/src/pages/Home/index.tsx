import React, { Component } from 'react';
import { inject } from 'mobx-react';

import { withInfura } from '@linkexchange/utils/web3';
import AddLink from '@linkexchange/new-add-link';
import Modal from '@linkexchange/components/src/Modal';
import { Details, Lists } from '@linkexchange/new-details';
import { WidgetSettings } from '@linkexchange/widget-settings';
import Tooltip from '@linkexchange/components/src/Tooltip';
import Button from '@linkexchange/components/src/NewButton';
import Switch from '@linkexchange/components/src/utils/Switch';
import BlocksTillConclusion from '@linkexchange/blocks-till-conclusion';
import BlocksTillConclusionProvider from '@linkexchange/blocks-till-conclusion-provider';
import Status from '@linkexchange/status';

import Header from './components/Header';
import Welcome from './components/Welcome';
import HowToBuy from './components/HowToBuy';
import BoostLink from './components/BoostLink';
import BlocksStore from '../../stores/blocks';

const BlocksTillConclusionWithInfura = withInfura(BlocksTillConclusion);

import * as style from './home.scss';

interface IProps {
  blocks: BlocksStore;
  widgetSettings: WidgetSettings;
}

interface IState {
  openedModal: 'none' | 'Welcome' | 'HowToBuy' | 'AddLink';
}

class Home extends Component<IProps, IState> {
  state: IState = {
    openedModal: 'Welcome',
  };

  render() {
    const { widgetSettings, blocks } = this.props;
    const { openedModal } = this.state;
    return (
      <div className={style.self}>
        <Header widgetSettings={widgetSettings} blocks={blocks} />
        <Details className={style.details}>
          <BlocksTillConclusionProvider
            startBlock={blocks.startBlock}
            endBlock={blocks.endBlock}
            asset={widgetSettings.asset}
            render={({ enabled, reason }) => (
              <div className={style.addLinkContainer}>
                <Tooltip text={reason}>
                  <Button disabled={!enabled} color="empty" className={style.addLink} onClick={this._addLink}>
                    Add link
                  </Button>
                </Tooltip>
              </div>
            )}
          />
          <BlocksTillConclusionWithInfura
            startBlock={blocks.startBlock}
            endBlock={blocks.endBlock}
            asset={widgetSettings.asset}
            className={style.blocksTillConclusion}
          />
          <Lists boostLinkComponent={BoostLink} />
        </Details>
        <Modal isOpen={openedModal !== 'none'} onCloseRequest={this._closeModal}>
          <Switch expresion={this.state.openedModal}>
            <Switch.Case condition="AddLink">
              <AddLinkWithInjectedWeb3AndTokenDetails
                loadBalance
                asset={widgetSettings.asset}
                openWidgetDetails={this._closeModal}
              />
            </Switch.Case>
            <Switch.Case condition="HowToBuy">
              <HowToBuy gotBens={this._closeModal} />
            </Switch.Case>
            <Switch.Case condition="Welcome">
              <Welcome
                startBlock={blocks.startBlock}
                endBlock={blocks.endBlock}
                asset={widgetSettings.asset}
                purchaseBens={this._purchaseBens}
                gotBens={this._closeModal}
              />
            </Switch.Case>
          </Switch>
        </Modal>
        <Status asset={widgetSettings.asset} />
      </div>
    );
  }

  _addLink = () => {
    this.setState({ openedModal: 'AddLink' });
  };

  _closeModal = () => {
    this.setState({ openedModal: 'none' });
  };

  _purchaseBens = () => {
    this.setState({ openedModal: 'HowToBuy' });
  };
}

export default inject('blocks')(withWidgetSettings(Home));
