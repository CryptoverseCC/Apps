import { h, Component } from 'preact';

import * as style from './modal.scss';

interface IModalProps {
  isOpen: boolean;
  onCloseRequest?: () => void;
}

export default class Modal extends Component<IModalProps, {}> {

  componentDidMount() {
    document.addEventListener('wheel', this._consumeEvent);
    document.addEventListener('mousewheel', this._consumeEvent);
  }

  componentWillUnmount() {
    document.removeEventListener('wheel', this._consumeEvent);
    document.removeEventListener('mousewheel', this._consumeEvent);
  }

  render() {
    const { isOpen, children } = this.props;
    if (!isOpen) {
      return <div />;
    }

    return (
      <div class={style.self} onClick={this._onOverlayClick}>
        <div class={style.content} onClick={this._consumeEvent}>
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

  _consumeEvent = (event: MouseEvent) => {
    event.stopImmediatePropagation();
  }
}
