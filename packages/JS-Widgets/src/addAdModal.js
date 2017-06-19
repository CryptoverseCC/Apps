import { h } from 'preact';

import Modal from './components/modal';
import AddAd from './components/addAd';

const AddAdModal = ({ context, isOpen, onCloseRequest }) => {
  return (
    <Modal isOpen={isOpen} onCloseRequest={onCloseRequest}>
      <AddAd context={context} onFinish={onCloseRequest} />
    </Modal>
  );
};

export default AddAdModal;
