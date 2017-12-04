import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Modal from '@linkexchange/components/src/Modal';
import Button from '@linkexchange/components/src/NewButton';
import Switch from '@linkexchange/components/src/utils/Switch';
import { IWidgetState } from '@linkexchange/ducks/widget';
import { Details, Lists } from '@linkexchange/details';
import AddLink from '@linkexchange/add-link';

import BlocksTillConclusion from '../../components/BlocksTillConclusion';
import BoostLink from './components/BoostLink';

import Header from './components/Header';

import * as style from './home.scss';
import Welcome from './components/Welcome';

interface IProps {
  widgetSettings: IWidgetState;
}

interface IState {
  openedModal: 'none' | 'Welcome' | 'AddLink';
}

class Home extends Component<IProps, IState> {
  state = {
    openedModal: 'Welcome',
  };

  render() {
    const { widgetSettings } = this.props;
    const { openedModal } = this.state;
    return (
      <div className={style.self}>
        <Header />
        <Details standaloneMode className={style.details}>
          <Button className={style.addLink} color="empty" onClick={this._addLink}>Add link</Button>
          <BlocksTillConclusion
            asset={widgetSettings.asset}
            className={style.blocksTillConclusion}
          />
          <Lists boostLinkComponent={BoostLink} />
        </Details>
        <Modal isOpen={openedModal !== 'none'} onCloseRequest={this._closeModal}>
          <Switch expresion={this.state.openedModal}>
            <Switch.Case condition="AddLink">
              <AddLink openWidgetDetails={this._closeModal} />
            </Switch.Case>
            <Switch.Case condition="Welcome">
              <Welcome
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
    return null;
  }
}

const mapStateToProps = ({ widget }: { widget: IWidgetState}) => ({
  widgetSettings: widget,
});

export default connect(mapStateToProps)(Home);
