import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { withInfura, withInjectedWeb3 } from '@linkexchange/utils/web3';
import { withTokenDetails, withInjectedWeb3AndTokenDetails } from '@linkexchange/token-details-provider';
import AddLinkComponent from '@linkexchange/add-link';
import Modal from '@linkexchange/components/src/Modal';
import { Details, Lists } from '@linkexchange/details';
import { IWidgetState } from '@linkexchange/ducks/widget';
import Tooltip from '@linkexchange/components/src/Tooltip';
import Button from '@linkexchange/components/src/NewButton';
import Switch from '@linkexchange/components/src/utils/Switch';

import Header from './components/Header';
import Welcome from './components/Welcome';
import HowToBuy from './components/HowToBuy';
import BoostLink from './components/BoostLink';
import BlocksTillConclusion from '../../components/BlocksTillConclusion';
import BlocksTillConclusionProvider from '../../providers/BlocksTillConclusionProvider';

const BlocksTillConclusionWithInfura = withInfura(BlocksTillConclusion);
const BlocksTillConclusionProviderWithInjectedWeb3 = withInjectedWeb3(BlocksTillConclusionProvider);
const AddLink = withInjectedWeb3AndTokenDetails(AddLinkComponent);

import { IBentynState } from '../../ducks/bentyn';

import * as style from './home.scss';

interface IProps {
  bentyn: IBentynState;
  widgetSettings: IWidgetState;
}

interface IState {
  openedModal: 'none' | 'Welcome' | 'HowToBuy' | 'AddLink';
}

class Home extends Component<IProps, IState> {
  state: IState = {
    openedModal: 'Welcome',
  };

  render() {
    const { widgetSettings, bentyn } = this.props;
    const { openedModal } = this.state;
    return (
      <div className={style.self}>
        <Header />
        <Details standaloneMode className={style.details}>
          <BlocksTillConclusionProviderWithInjectedWeb3
            startBlock={bentyn.startBlock}
            endBlock={bentyn.endBlock}
            asset={widgetSettings.asset}
            render={({ enabled, reason }) => (
              <div className={style.addLinkContainer}>
                <Tooltip text={reason}>
                  <Button
                    disabled={!enabled}
                    color="empty"
                    className={style.addLink}
                    onClick={this._addLink}
                  >
                    Add link
                  </Button>
                </Tooltip>
              </div>
            )}
          />
          <BlocksTillConclusionWithInfura
            startBlock={bentyn.startBlock}
            endBlock={bentyn.endBlock}
            asset={widgetSettings.asset}
            className={style.blocksTillConclusion}
          />
          <Lists boostLinkComponent={BoostLink} />
        </Details>
        <Modal isOpen={openedModal !== 'none'} onCloseRequest={this._closeModal}>
          <Switch expresion={this.state.openedModal}>
            <Switch.Case condition="AddLink">
              <AddLink loadBalance asset={widgetSettings.asset} openWidgetDetails={this._closeModal} />
            </Switch.Case>
            <Switch.Case condition="HowToBuy">
              <HowToBuy />
            </Switch.Case>
            <Switch.Case condition="Welcome">
              <Welcome
                startBlock={bentyn.startBlock}
                endBlock={bentyn.endBlock}
                asset={widgetSettings.asset}
                purchaseBens={this._purchaseBens}
                gotBens={this._closeModal}
              />
            </Switch.Case>
          </Switch>
        </Modal>
      </div>
    );
  }

  _addLink = () => {
    this.setState({ openedModal: 'AddLink' });
  }

  _closeModal = () => {
    this.setState({ openedModal: 'none' });
  }

  _purchaseBens = () => {
    this.setState({ openedModal: 'HowToBuy' });
  }
}

const mapStateToProps = ({ widget, bentyn }: { widget: IWidgetState, bentyn: IBentynState }) => ({
  bentyn,
  widgetSettings: widget,
});

export default connect(mapStateToProps)(Home);
