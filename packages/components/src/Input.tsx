import { h, Component } from 'preact';
import * as classnames from 'classnames/bind';

import * as style from './input.scss';

const cx = classnames.bind(style);

interface IInputProps {
  placeholder: string;
  class?: string;
  value: string;
  disabled?: boolean;
  onChange(value: string): void;
  multiline?: boolean;
  errorMessage?: string;
}

export default class Input extends Component<IInputProps, {}> {

  input: {
    focus(): void;
  } | undefined;

  render() {
    const {  class: className, placeholder, errorMessage, value, onChange, multiline, disabled = false } = this.props;
    return (
      <div class={cx(style.self, { invalid: !!errorMessage })}>
        {!multiline ? (
          <input
            ref={this._onInputRef}
            class={style.input}
            value={value}
            disabled={disabled}
            required
            onInput={this._onChange}
          />
        ) : (
          <textarea
            ref={this._onInputRef}
            class={style.input}
            value={value}
            required
            onInput={this._onChange}
            rows={3}
          />
        )}
        <span class={style.placeholder} onClick={this._onPlaceholderClick}>{placeholder}</span>
        {errorMessage && <span class={style.error}>{errorMessage}</span>}
      </div>
    );
  }

  _onChange = (e) => {
    this.props.onChange(e.target.value);
  }

  _onInputRef = (ref) => this.input = ref;

  _onPlaceholderClick = () => {
    if (this.input) {
      this.input.focus();
    }
  }
}
