import { h, Component } from 'preact';

import './modal.css';

export default class Modal extends Component {

  render({ isOpen, children }) {
    if (!isOpen) {
      return null;
    }

    return (
      <div class="modal" onClick={this._onOverlayClick}>
        <div class="content" onClick={this._onContentClick}>
          {children}
        </div>
      </div>
    );
  }

  _onOverlayClick = () => {
    if (this.props.onCloseRequest) {
      this.props.onCloseRequest();
    }
  }

  _onContentClick = (event) => {
    event.stopPropagation();
  };
}
