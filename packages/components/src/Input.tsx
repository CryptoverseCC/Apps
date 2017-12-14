import React, { Component } from 'react';
import classnames from 'classnames/bind';

import * as style from './input.scss';

const cx = classnames.bind(style);

type TInputProps = React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  multiline?: boolean;
  errorMessage?: string;
};

export default class Input extends Component<TInputProps, {}> {

  input: HTMLInputElement;

  render() {
    const { className, placeholder, errorMessage, value, multiline, disabled = false, ...restProps } = this.props;
    return (
      <div className={cx(style.self, className, { invalid: !!errorMessage })}>
        {!multiline ? (
          <input
            ref={this._onInputRef}
            className={style.input}
            value={value}
            disabled={disabled}
            required
            {...restProps}
          />
        ) : (
          <textarea
            ref={this._onInputRef}
            className={style.input}
            value={value}
            disabled={disabled}
            required
            rows={3}
            {...restProps}
          />
        )}
        <span className={style.placeholder} onClick={this._onPlaceholderClick}>{placeholder}</span>
        {errorMessage && <span className={style.error}>{errorMessage}</span>}
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
