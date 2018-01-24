import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { withInfura, withInjectedWeb3 } from '@linkexchange/utils/web3';
import { AddLinkWithInjectedWeb3AndTokenDetails } from '@linkexchange/add-link';
import Modal from '@linkexchange/components/src/Modal';
import { Details, Lists } from '@linkexchange/details';
import { IWidgetState } from '@linkexchange/ducks/widget';
import Tooltip from '@linkexchange/components/src/Tooltip';
import Button from '@linkexchange/components/src/NewButton';
import Switch from '@linkexchange/components/src/utils/Switch';
import BlocksTillConclusion from '@linkexchange/blocks-till-conclusion';
import BlocksTillConclusionProvider from '@linkexchange/blocks-till-conclusion-provider';
import Status from '@linkexchange/status';

import Header from './components/Header';
import BoostLink from './components/BoostLink';

const BlocksTillConclusionWithInfura = withInfura(BlocksTillConclusion);

import { IBlocksState } from '../../../ducks/blocks';

import * as style from './home.scss';

interface IProps {
  blocks: IBlocksState;
  widgetSettings: IWidgetState;
}

interface IState {
  openedModal: 'none' | 'AddLink';
}

class Home extends Component<IProps, IState> {
  state: IState = {
    openedModal: 'none',
  };

  render() {
    const { widgetSettings, blocks } = this.props;
    const { openedModal } = this.state;
    return (
      <div className={style.self}>
        <Header asset={widgetSettings.asset} widgetSettings={widgetSettings} blocks={blocks} />
        <Details standaloneMode className={style.details}>
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
}

const mapStateToProps = ({ widget, blocks }: { widget: IWidgetState; blocks: IBlocksState }) => ({
  blocks,
  widgetSettings: widget,
});

export default connect(mapStateToProps)(Home);
