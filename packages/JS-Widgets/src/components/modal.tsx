import { h, Component } from 'preact';

import * as style from  './modal.scss';

interface IModalProps {
  isOpen: boolean;
  onCloseRequest?: () => void;
}

export default class Modal extends Component<IModalProps, {}> {

  render() {
    const { isOpen, children } = this.props;
    if (!isOpen) {
      return <div />;
    }

    return (
      <div class={style.self} onClick={this._onOverlayClick}>
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
