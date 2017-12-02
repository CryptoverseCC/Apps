import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Modal from '@linkexchange/components/src/Modal';
import Button from '@linkexchange/components/src/NewButton';
import { IWidgetState } from '@linkexchange/ducks/widget';
import { Details, Lists } from '@linkexchange/details';
import AddLink from '@linkexchange/add-link';

import BlocksTillConclusion from '../../components/BlocksTillConclusion';
import BoostLink from './components/BoostLink';

import Header from './components/Header';

import * as style from './home.scss';

interface IProps {
  widgetSettings: IWidgetState;
}

interface IState {
  isModalOpen: boolean;
}

class Home extends Component<IProps, IState> {
  state = {
    isModalOpen: false,
  };

  render() {
    const { widgetSettings } = this.props;
    const { isModalOpen } = this.state;
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
        <Modal isOpen={isModalOpen} onCloseRequest={this._closeModal}>
          <AddLink openWidgetDetails={this._closeModal} />
        </Modal>
      </div>
    );
  }

  _addLink = () => {
    this.setState({ isModalOpen: true });
  }

  _closeModal = () => {
    this.setState({ isModalOpen: false });
  }
}

const mapStateToProps = ({ widget }: { widget: IWidgetState}) => ({
  widgetSettings: widget,
});

export default connect(mapStateToProps)(Home);
