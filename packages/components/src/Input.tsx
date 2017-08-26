import { h, Component } from 'preact';
import * as classnames from 'classnames/bind';

import * as style from './input.scss';

const cx = classnames.bind(style);

type TInputProps = JSX.HTMLAttributes & {
  placeholder: string;
  multiline?: boolean;
  errorMessage?: string;
};

export default class Input extends Component<TInputProps, {}> {

  input: {
    focus(): void;
  } | undefined;

  render({ class: className, placeholder, errorMessage, value, multiline, disabled = false, ...restProps }
    : TInputProps) {
    return (
      <div class={cx(style.self, className, { invalid: !!errorMessage })}>
        {!multiline ? (
          <input
            ref={this._onInputRef}
            class={style.input}
            value={value}
            disabled={disabled}
            required
            {...restProps}
          />
        ) : (
          <textarea
            ref={this._onInputRef}
            class={style.input}
            value={value}
            disabled={disabled}
            required
            rows={3}
            {...restProps}
          />
        )}
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
