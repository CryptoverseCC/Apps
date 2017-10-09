import React from 'react';

type TCheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string,
  checked?: boolean,
  onChange?: (e: any) => void,
};

const Checkbox = (props: TCheckboxProps) => (
  <label>
    <input type="checkbox" {...props} />
    {props.label}
  </label>
);

export default Checkbox;
