import { h } from 'preact';
import Select from 'react-select';

import 'react-select/dist/react-select.css';

const Dropdown = ({ disabled, placeholder, value, onChange, options, ...restProps }) => (
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
