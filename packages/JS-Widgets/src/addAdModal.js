import { h } from 'preact';

import Modal from './components/modal';
import AddAd from './components/addAd';

const AddAdModal = ({ context, isOpen, onCloseRequest, onSuccess, onError }) => {
  return (
    <Modal isOpen={isOpen} onCloseRequest={onCloseRequest}>
      <AddAd context={context} onSuccess={onSuccess} onError={onError} />
    </Modal>
  );
};

export default AddAdModal;
