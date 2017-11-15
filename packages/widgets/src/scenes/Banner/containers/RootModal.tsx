import React from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import Loadable from 'react-loadable';

import Modal from '@userfeeds/apps-components/src/Modal';

import { IRootState } from '../../../ducks';
import { modalActions } from '../../../ducks/modal';

const Loading = (props) => {
  if (props.pastDelay) {
    return <div>Loading...</div>;
  }
  return null;
};

const LazyAddLink = Loadable({
  loader: () => import('../../AddLink'),
  loading: Loading,
});

const LazyWidgetDatails = Loadable({
  loader: () => import('../../WidgetDetails'),
  loading: Loading,
});

const ModalMapping = {
  addLink: LazyAddLink,
  widgetDetails: LazyWidgetDatails,
};

const mapStateToProps = ({ modal }: IRootState) => ({ modal });
const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(modalActions.close()),
});

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);
type IRootModalProps = typeof State2Props & typeof Dispatch2Props;

const RootModal = ({ modal, closeModal }: IRootModalProps) => {
  if (!modal.modalName) {
    return null;
  }

  if (modal.modalName === 'widgetDetails') {
    LazyAddLink.preload();
  }

  const ModalBody = ModalMapping[modal.modalName];
  const props = modal.modalProps || {};

  return (
    <Modal isOpen onCloseRequest={closeModal}>
      <ModalBody {...props} />
    </Modal>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RootModal);
