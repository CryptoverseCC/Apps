import React, { PureComponent, ReactChild } from 'react';
import classnames from 'classnames';

import * as InputStyles from './input.scss';

type TInputProps = React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  multiline?: boolean;
  displayName?: string;
  error?: string;
  warning?: string;
  append?: (className: string) => ReactChild;
  showStatus?: boolean;
};

export default class Input extends PureComponent<TInputProps> {
  static defaultProps = { displayName: 'Input' };
  ref?: HTMLElement;

  focus() {
    if (this.ref) {
      this.ref.focus();
    }
  }

  render() {
    const { multiline, showStatus = true, error, warning, className, displayName, append, ...props } = this.props;
    const containerClassNames = classnames(className, InputStyles.InputContainer, {
      [InputStyles.hasError]: showStatus && error,
      [InputStyles.hasWarning]: showStatus && warning,
    });
    const inputClassNames = classnames(className, InputStyles.Input, {
      [InputStyles.hasError]: showStatus && error,
      [InputStyles.hasWarning]: showStatus && warning,
      [InputStyles.hasAppend]: !!append,
    });
    const statusClassNames = classnames(InputStyles.Status, { [InputStyles.Error]: error });
    return multiline ? (
      <React.Fragment>
        <div className={containerClassNames}>
          <textarea className={inputClassNames} {...props} key={1} rows={3} ref={this._onRef} />
        </div>
        {showStatus && (!!error || !!warning) && <p className={statusClassNames}>{error}</p>}
      </React.Fragment>
      ) : (
      <React.Fragment>
        <div className={containerClassNames}>
          <input className={inputClassNames} {...props} key={1} ref={this._onRef} />
          {append && append(InputStyles.Appended)}
        </div>
        {showStatus && (!!error || !!warning) && <p className={statusClassNames}>{error}</p>}
      </React.Fragment>
    );
  }

  _onRef = (ref) => (this.ref = ref);
}
