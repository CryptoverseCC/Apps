import React from 'react';
import Select from 'react-select';

import 'react-select/dist/react-select.css';

// ToDo remove any;
interface IDropdownProps {
  disabled?: boolean;
  placeholder: string;
  value: any;
  onChange(value: any): void;
  options: any;
  className?: string;
  style?: object;
}

const Dropdown = ({
  disabled,
  placeholder,
  value,
  onChange,
  options,
  ...restProps,
}: IDropdownProps) => (
  <Select
    disabled={disabled}
    clearable={false}
    placeholder={placeholder}
    options={options}
    value={value}
    onChange={onChange}
    {...restProps}
  />
);

export default Dropdown;
