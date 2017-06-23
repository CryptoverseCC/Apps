import React from 'react';
import { RadioButton, RadioButtonGroup as UIRadioButtonGroup } from 'material-ui/RadioButton';

import Label from './Label';

import style from './RadioButtonGroup.scss';

const RadioButtonGroup = ({ label, name, onChange, options }) => {
  return (
    <div className={style.this}>
      <Label>{label}</Label>
      <UIRadioButtonGroup
        name={name}
        className={style.options}
        defaultSelected={options[0].value}
        onChange={onChange}
      >
        { options.map(({ value, label, ...extra }) => (
            <RadioButton
              className={style.option}
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
