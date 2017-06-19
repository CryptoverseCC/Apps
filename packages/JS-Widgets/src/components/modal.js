import { h, Component } from 'preact';

import style from './modal.scss';

export default class Modal extends Component {

  render({ isOpen, children }) {
    if (!isOpen) {
      return null;
    }

    return (
      <div class={style.this} onClick={this._onOverlayClick}>
        <div class={style.content} onClick={this._onContentClick}>
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
