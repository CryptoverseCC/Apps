import { h, Component } from 'preact';
import * as classnames from 'classnames';

import * as style from './input.scss';

interface IInputProps {
  placeholder: string;
  class?: string;
  value: string;
  disabled?: boolean;
  onChange(value: string): void;
  multiline?: boolean;
}

export default class Input extends Component<IInputProps, {}> {

  input: {
    focus(): void;
  } | undefined;

  render() {
    const {  class: className, placeholder, value, onChange, multiline, disabled = false } = this.props;
    const _onChange = (e) => onChange(e.target.value);

    return (
      <div class={classnames(className, style.self)}>
        {!multiline ? (
          <input
            ref={this._onInputRef}
            class={style.input}
            value={value}
            disabled={disabled}
            required
            onInput={_onChange}
          />
        ) : (
            <textarea
              ref={this._onInputRef}
              class={style.input}
              value={value}
              required
              onInput={_onChange}
              rows={3}
            />
          )}
        <span class={style.placeholder} onClick={this._onLabelClick}>{placeholder}</span>
      </div>
    );
  }

  _onLabelClick = () => {
    if (this.input) {
      this.input.focus();
    }
  }

  _onInputRef  = (ref) => {
    this.input = ref;
  }
}
