import React, { Component } from 'react';
import classnames from 'classnames';
import * as RadioStyles from './radio.scss';
import Pill from './Pill';

type TRadio = React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  checked?: boolean;
  soon?: boolean;
  disabled?: boolean;
};

const Radio = ({ checked, disabled, soon, children, className, style, ...props }: TRadio) => {
  const labelClassNames = classnames(className, RadioStyles.Radio, {
    [RadioStyles.checked]: checked,
    [RadioStyles.disabled]: disabled,
  });
  const decoratedChildren = React.Children.map(children, (child) => {
    return child && child.type && child.type.name === 'Icon'
      ? React.cloneElement(child, { className: classnames(child.className, RadioStyles.Icon) })
      : child;
  });
  return (
    <label className={labelClassNames} style={style}>
      <input
        type="radio"
        name="impressions"
        className={RadioStyles.Input}
        checked={checked}
        disabled={disabled}
        {...props}
      />
      <div className={RadioStyles.FakeInput} />
      {decoratedChildren}
      {soon && <Pill className={RadioStyles.Soon}>Soon</Pill>}
    </label>
  );
};

export default Radio;
