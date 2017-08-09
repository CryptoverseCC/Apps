import { h, Component } from 'preact';
import * as classnames from 'classnames/bind';

import * as style from './input.scss';

const cx = classnames.bind(style);

interface IInputProps {
  placeholder: string;
  errorMessage?: string;
}

export default class Input extends Component<IInputProps & JSX.HTMLAttributes, {}> {

  input: {
    focus(): void;
  } | undefined;

  render({ placeholder, errorMessage, ...restProps }) {
    return (
      <div class={cx('self', { invalid: !!errorMessage })}>
        <input class={style.input} ref={this._onInputRef} required {...restProps} />
        <span class={style.placeholder} onClick={this._onPlaceholderClick}>{placeholder}</span>
        {errorMessage && <span class={style.error}>{errorMessage}</span>}
      </div>
    );
  }

  _onInputRef = (ref) => this.input = ref;

  _onPlaceholderClick = () => {
    if (this.input) {
      this.input.focus();
    }
  }
}
