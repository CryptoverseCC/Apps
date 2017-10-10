import React, { Component } from 'react';
import classnames from 'classnames';
import Input from '../components/Input'
import Radio from '../components/Radio'
import { input as fieldInput } from '../components/field.scss';
import * as Field from '../components/Field';

export default class Configurator extends Component<{}, {}> {
  render() {
    return (
      <div>
        <Field.Field>
          <Field.Title>
            Userfeed Address
          </Field.Title>
          <Field.Description>
            Add description here about userfeed address
          </Field.Description>
          <Input type="text" className={fieldInput} />
        </Field.Field>
        <Field.Field>
          <Field.Title>
            Whitelist
          </Field.Title>
          <Field.Description>
            Add description here about whitelist identifier
          </Field.Description>
          <Input type="text" className={fieldInput} error={'This is bad :('}/>
        </Field.Field>
        <Field.Field>
          <Field.Title>
            Title
          </Field.Title>
          <Field.Description>
            Add description here about title
          </Field.Description>
          <Input
            type="text"
            className={fieldInput}
            multiline
            invalid
          />
          <Field.Error>
            This is a beary bad error.
          </Field.Error>
        </Field.Field>
        <Field.Field>
          <Field.Title>
            Declared Amount of Impressions
          </Field.Title>
          <Field.Description>
            Add description here about declared amount of impressions
          </Field.Description>
          <Field.RadioGroup radioWidth="175px">
            <Radio>N/A</Radio>
            <Radio checked>100 - 1.000</Radio>
            <Radio>1.001 - 10.000</Radio>
            <Radio>10.001 - 100.000</Radio>
            <Radio>100.001 - 1 milion</Radio>
            <Radio>1 milion - ∞</Radio>
          </Field.RadioGroup>
        </Field.Field>
      </div>
    );
  }
}
