import React from 'react';

import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

import './Dropdown.css';

const Dropdown = ({ disabled, label, value, onChange, options}) => {
  return (
    <SelectField
      disabled={disabled}
      floatingLabelText={label}
      value={value}
      onChange={onChange}
      className="Dropdown"
    >
      { options.map(({ label, value }) => (
        <MenuItem key={value} value={value} primaryText={label} />
      ))}
    </SelectField>
  );
};

export default Dropdown;
