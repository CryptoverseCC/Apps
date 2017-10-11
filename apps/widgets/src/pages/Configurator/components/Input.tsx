import React from 'react';
import classnames from 'classnames';
import * as InputStyles from './input.scss';

type TInputProps = React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  multiline?: boolean;
  invalid?: boolean;
};

const Input = ({multiline, invalid, className, ...props}: TInputProps) => {
  const classNames = classnames(className, InputStyles.Input, { [InputStyles.invalid]: invalid });

  return multiline ?
    <textarea className={classNames} {...props} key={1} rows={3}/> :
    <input className={classNames} {...props} key={1}/>;
};

export default Input;
