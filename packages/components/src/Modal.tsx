import React, { Component } from 'react';

import * as style from './modal.scss';

interface IModalProps {
  isOpen: boolean;
  onCloseRequest?: () => void;
}

export default class Modal extends Component<IModalProps, {}> {
  pushedState: boolean = false;
  poppedState: boolean = false;

  componentWillUnmount() {
    if (this.pushedState && !this.poppedState) {
      history.back();
    }
    this._removeEventListeners();
  }

  componentWillReceiveProps(newProps: IModalProps) {
    if (newProps.isOpen && this.props.isOpen !== newProps.isOpen) {
      this._registerEventListeners();
      history.pushState(null, '', document.URL);
      this.pushedState = true;
      this.poppedState = false;
    } else if (!newProps.isOpen && this.props.isOpen !== newProps.isOpen) {
      if (this.pushedState && !this.poppedState) {
        history.back();
        this.poppedState = true;
      }
      this._removeEventListeners();
    }
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

  _onPopState = () => {
    this.poppedState = true;
    this._onOverlayClick();
  };

  _onOverlayClick = () => {
    if (this.props.onCloseRequest) {
      this.props.onCloseRequest();
    }
  };

  _consumeEvent = (event) => {
    event.stopPropagation();
  };

  _closeOnEsc = (event: KeyboardEvent) => {
    if (event.keyCode === 27 && this.props.onCloseRequest) {
      this.props.onCloseRequest();
    }
  };

  _registerEventListeners = () => {
    document.addEventListener('wheel', this._consumeEvent);
    document.addEventListener('mousewheel', this._consumeEvent);
    document.addEventListener('keydown', this._closeOnEsc);
    window.addEventListener('popstate', this._onPopState);
  };

  _removeEventListeners = () => {
    document.removeEventListener('wheel', this._consumeEvent);
    document.removeEventListener('mousewheel', this._consumeEvent);
    document.removeEventListener('keydown', this._closeOnEsc);
    window.removeEventListener('popstate', this._onPopState);
  };
}
