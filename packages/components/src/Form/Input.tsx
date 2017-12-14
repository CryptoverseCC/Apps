import React, { PureComponent } from 'react';
import classnames from 'classnames';

import * as InputStyles from './input.scss';

type TInputProps = React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  multiline?: boolean;
  invalid?: boolean;
  displayName?: string;
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
    const { multiline, invalid, className, displayName, ...props } = this.props;
    const classNames = classnames(className, InputStyles.Input, { [InputStyles.invalid]: invalid });

    return multiline
      ? (<textarea className={classNames} {...props} key={1} rows={3} ref={this._onRef} />)
      : (<input className={classNames} {...props} key={1} ref={this._onRef} />);
  }

  _onRef = (ref) => this.ref = ref;
}
