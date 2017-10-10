import React, { Component } from 'react';
import classnames from 'classnames';
import Input from '../components/Input';
import Radio from '../components/Radio';
import { input as fieldInput } from '../components/field.scss';
import * as Field from '../components/Field';
import { SizeLeaderboard, SizeRectangle } from '../components/Size';

export default class Configurator extends Component<{}, {}> {
  render() {
    return (
      <div>
        <Field.Field>
          <Field.Title>Userfeed Address</Field.Title>
          <Field.Description>Add description here about userfeed address</Field.Description>
          <Input type="text" className={fieldInput} />
        </Field.Field>
        <Field.Field>
          <Field.Title>Whitelist</Field.Title>
          <Field.Description>Add description here about whitelist identifier</Field.Description>
          <Input type="text" className={fieldInput} />
        </Field.Field>
        <Field.Field>
          <Field.Title>Title</Field.Title>
          <Field.Description>Add description here about title</Field.Description>
          <Input type="text" className={fieldInput} />
        </Field.Field>
        <Field.Field>
          <Field.Title>Description</Field.Title>
          <Field.Description>Add description here about description</Field.Description>
          <Input type="text" className={fieldInput} multiline />
        </Field.Field>
        <Field.Field>
          <Field.Title>Declared Amount of Impressions</Field.Title>
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
        <Field.Field>
          <Field.Title>Preferred Contact Method</Field.Title>
          <Input type="email" className={fieldInput} />
        </Field.Field>
        <Field.Field>
          <Field.Title>Select Size</Field.Title>
          <Field.RadioGroup radioWidth="270px">
            <Radio>
              <SizeLeaderboard />
            </Radio>
            <Radio checked>
              <SizeRectangle />
            </Radio>
          </Field.RadioGroup>
        </Field.Field>
      </div>
    );
  }
}
