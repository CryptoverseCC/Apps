import React, { Component } from 'react';
import classnames from 'classnames';
import * as RadioStyles from './radio.scss';

type TRadio = React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  checked?: boolean;
};

const Radio = ({checked, children, className, style, ...props}: TRadio) => {
  const labelClassNames = classnames(className, RadioStyles.Radio, { [RadioStyles.checked]: checked });
  return (
    <label className={labelClassNames} style={style}>
      <input
        type="radio"
        name="impressions"
        className={RadioStyles.Input}
        checked={checked}
        {...props}
      />
      <div className={RadioStyles.FakeInput}/>
      {children}
    </label>
  );
};

export default Radio;
