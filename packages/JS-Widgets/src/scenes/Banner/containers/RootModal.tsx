import { h } from 'preact';
import { connect } from 'preact-redux';
import { returntypeof } from 'react-redux-typescript';

import Modal from '@userfeeds/apps-components/src/Modal';

import { IRootState } from '../../../ducks';
import { modalActions } from '../../../ducks/modal';

import AddLink from '../../AddLink';
import WidgetDetails from '../../WidgetDetails';

const ModalMapping = {
  addLink: AddLink,
  widgetDetails: WidgetDetails,
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

  const ModalBody = ModalMapping[modal.modalName];
  const props = modal.modalProps || {};

  return (
    <Modal isOpen onCloseRequest={closeModal}>
      <ModalBody {...props} />
    </Modal>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RootModal);
