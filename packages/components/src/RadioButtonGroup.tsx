import { h, Component, FunctionalComponent } from 'preact';

import Label from './Label';

import * as style from './radioButtonGroup.scss';

interface IOption {
  label: string;
  value: any;
  disabled?: boolean;
  component?: FunctionalComponent<{ option: IOption }>;
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
    const _onChange = (e) => onChange(e.target.value);

    return (
      <div class={style.self}>
        {options.map((option, index) => (
          <div class={style.option} key={option.value + index}>
            <input
              type="radio"
              id={`${name}control_${index}`}
              name={name}
              value={option.value}
              disabled={option.disabled}
              checked={option.value === value}
              onChange={_onChange}
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