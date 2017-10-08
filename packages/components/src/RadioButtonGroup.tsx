import React, { Component } from 'react';

import Label from './Label';

import * as style from './radioButtonGroup.scss';

interface IOption {
  label: string;
  value: any;
  disabled?: boolean;
  // component?: FunctionalComponent<{ option: IOption }>;
  component: any;
}

interface IRadioButtonGroupProps {
  name: string;
  value: any;
  onChange(option: IOption): void;
  options: IOption[];
}

export class RadioButtonGroup extends Component<IRadioButtonGroupProps, {}> {

  render() {
    const { name, value, onChange, options } = this.props;

    return (
      <div className={style.self}>
        {options.map((option, index) => (
          <div className={style.option} key={option.value + index}>
            <input
              type="radio"
              id={`${name}control_${index}`}
              name={name}
              value={option.value}
              disabled={option.disabled}
              checked={option.value === value}
              onChange={onChange}
            />
            <label for={`${name}control_${index}`}>
              {this._renderLabel(option)}
            </label>
          </div>
        ))}
      </div>
    );
  }

  _renderLabel = (option) => {
    if (option.component) {
      const Cmp = option.component;
      return <Cmp option={option} />;
    }

    return option.label;
  }
}

export default RadioButtonGroup;
