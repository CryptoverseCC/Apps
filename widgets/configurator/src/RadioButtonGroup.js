import React from 'react';
import { RadioButton, RadioButtonGroup as UIRadioButtonGroup } from 'material-ui/RadioButton';

import Label from './Label';

import './RadioButtonGroup.css';

const RadioButtonGroup = ({ label, name, onChange, options }) => {
  return (
    <div>
      <Label>{label}</Label>
      <UIRadioButtonGroup
        name={name}
        className="RadioButtonGroup-options"
        defaultSelected={options[0].value}
        onChange={onChange}
      >
        { options.map(({ value, label, ...extra }) => (
            <RadioButton
              className="RadioButtonGroup-option"
              key={value}
              value={value}
              label={label}
              {...extra}
            />
          ))
        }
      </UIRadioButtonGroup>
    </div>
  );
};

export default RadioButtonGroup;
