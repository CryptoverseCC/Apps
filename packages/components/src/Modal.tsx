import React, { Component } from 'react';

import * as style from './modal.scss';

interface IModalProps {
  isOpen: boolean;
  onCloseRequest?: () => void;
}

export default class Modal extends Component<IModalProps, {}> {

  componentDidMount() {
    document.addEventListener('wheel', this._consumeEvent);
    document.addEventListener('mousewheel', this._consumeEvent);
    document.addEventListener('keydown', this._closeOnEsc);
    window.addEventListener('popstate', this._onOverlayClick);

    history.pushState(null, '', document.URL);
  }

  componentWillUnmount() {
    document.removeEventListener('wheel', this._consumeEvent);
    document.removeEventListener('mousewheel', this._consumeEvent);
    document.removeEventListener('keydown', this._closeOnEsc);
    window.removeEventListener('popstate', this._onOverlayClick);
  }

  render() {
    const { isOpen, children } = this.props;
    if (!isOpen) {
      return <div />;
    }

    return (
      <div className={style.self} onClick={this._onOverlayClick}>
        <div className={style.content} onClick={this._consumeEvent}>
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

  _consumeEvent = (event) => {
    event.stopPropagation();
  }

  _closeOnEsc = (event: KeyboardEvent) => {
    if (event.keyCode === 27 && this.props.onCloseRequest) {
      this.props.onCloseRequest();
    }
  }

}
