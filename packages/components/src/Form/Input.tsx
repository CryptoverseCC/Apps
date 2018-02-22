import React, { PureComponent, ReactChild } from 'react';
import classnames from 'classnames';

import * as InputStyles from './input.scss';

type TInputProps = React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  multiline?: boolean;
  displayName?: string;
  error?: string;
  append?: (className: string) => ReactChild;
  showStatus?: boolean;
  isActive?: boolean;
  bold?: boolean;
  primary?: boolean;
  currency?: ReactChild;
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
    const {
      multiline = false,
      isActive = false,
      showStatus = true,
      bold = false,
      primary = false,
      currency,
      error,
      className,
      displayName,
      append,
      ...props,
    } = this.props;
    const containerClassNames = classnames(className, InputStyles.InputContainer, {
      [InputStyles.hasError]: showStatus && error,
      [InputStyles.focus]: isActive,
      [InputStyles.primary]: primary,
    });
    const inputClassNames = classnames(className, InputStyles.Input, {
      [InputStyles.hasError]: showStatus && error,
      [InputStyles.hasAppend]: !!append,
      [InputStyles.bold]: bold,
      [InputStyles.primary]: primary,
      [InputStyles.Shadow]: multiline
    });
    return multiline ? (
      <React.Fragment>
        <div className={containerClassNames}>
          <textarea className={inputClassNames} {...props} key={1} rows={3} ref={this._onRef} />
        </div>
        {showStatus && !!error && <p className={InputStyles.Error}>{error}</p>}
      </React.Fragment>
    ) : (
      <React.Fragment>
        <div className={containerClassNames}>
          <div className={InputStyles.Shadow} style={{ display: 'flex', flexGrow: 1, maxWidth: '100%' }}>
            <div style={{ flexGrow: 1 }}>
              <input style={{width: '100%'}} className={inputClassNames} {...props} key={1} ref={this._onRef} />
            </div>
            {currency && <div className={InputStyles.Currency}>{currency}</div>}
          </div>
          {append && append(InputStyles.Appended)}
        </div>
        {showStatus && !!error && <p className={InputStyles.Error}>{error}</p>}
      </React.Fragment>
    );
  }

  _onRef = (ref) => (this.ref = ref);
}
