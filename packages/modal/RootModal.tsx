import React from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';

import Modal from '@linkexchange/components/src/Modal';

import { modalActions, IModalState } from './duck';

const mapStateToProps = ({ modal }: { modal: IModalState }) => ({ modal });
const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(modalActions.close()),
});

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);
type IRootModalProps = typeof State2Props & typeof Dispatch2Props;

export default (ModalMapping) => {
  const RootModal = ({ modal, closeModal }: IRootModalProps) => {
    if (!modal.modalName) {
      return null;
    }

    const ModalBody = ModalMapping[modal.modalName];
    const props = modal.modalProps || {};

    return (
      <Modal isOpen onCloseRequest={closeModal}>
        <ModalBody {...props} />
      </Modal>
    );
  };

  return connect(mapStateToProps, mapDispatchToProps)(RootModal);
};
