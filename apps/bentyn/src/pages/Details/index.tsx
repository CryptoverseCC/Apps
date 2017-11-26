import React, { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';

import AddLink from '@linkexchange/add-link';
import WidgetDetails from '@linkexchange/details';
import { fetchLinks } from '@linkexchange/details/duck';
import Modal from '@linkexchange/components/src/Modal';

import * as style from './details.scss';

const mapDispatchToProps = (dispatch) => ({
  fetchLinks: () => dispatch(fetchLinks()),
});

const Dispatch2Props = returntypeof(mapDispatchToProps);
type TDetailsProps = typeof Dispatch2Props;

interface IDetailsState {
  isModalOpen: boolean;
}

class Details extends Component<TDetailsProps, IDetailsState> {

  state = {
    isModalOpen: false,
  };

  componentDidMount() {
    this.props.fetchLinks();
  }

  render() {
    const { isModalOpen } = this.state;

    return (
      <div className={style.self}>
        <WidgetDetails standaloneMode className={style.details} onAddLink={this._onAddLink} />
        <Modal isOpen={isModalOpen} onCloseRequest={this._closeModal}>
          <AddLink openWidgetDetails={this._closeModal} />
        </Modal>
      </div>
    );
  }

  _onAddLink = () => {
    this.setState({ isModalOpen: true });
  }

  _closeModal = () => {
    this.setState({ isModalOpen: false });
  }
}

export default connect(null, mapDispatchToProps)(Details);