import { h } from 'preact';
import { connect } from 'preact-redux';
import { returntypeof } from 'react-redux-typescript';

import { IRootState } from '../../../reducers';
import { modalActions } from '../../../actions/modal';

import AddLink from '../../AddLink';
import ThankYou from '../..//ThankYou';
import WidgetDetails from '../../WidgetDetails';

import Modal from '../../../components/Modal';

const ModalMapping = {
  addLink: AddLink,
  thankYou: ThankYou,
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
