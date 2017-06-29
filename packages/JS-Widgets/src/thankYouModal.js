import { h, Component } from 'preact';

import Modal from './components/modal';
import Button from './components/button';
import TextWithLabel from './components/textWithLabel';

import { openUserfeedsUrl } from './utils/openUserfeedsUrl';

export default class ThankYouModal extends Component {

  render({ publisherNote, isOpen, onCloseRequest }) {
    return (
      <Modal isOpen={isOpen} onCloseRequest={onCloseRequest}>
        <TextWithLabel label="Publisher note" text={publisherNote} />
        <Button onClick={this._onLinkStatusClick}>Link Status</Button>
      </Modal>
    );
  }

  _onLinkStatusClick = () => {
    this.props.onCloseRequest();
    openUserfeedsUrl('apps/links/#/status/', this.props);
  };
}
