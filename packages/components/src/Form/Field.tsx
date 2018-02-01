import React from 'react';
import classnames from 'classnames';
import BoldText from '../BoldText';
import { isType } from '@linkexchange/utils';
import * as styles from './field.scss';
import Input from './Input';

export function validateField(validators: any[]): (value: any) => Promise<any> {
  return async (value: any) => {
    for (const validator of validators) {
      const error = await validator('', value);
      if (error) {
        return error;
      }
    }
  };
}

export const TextField = (props) => (
  <Field>
    <Title>{props.title}</Title>
    <Input {...props.input} type="text" />
    {props.meta.touched && <Error>{props.meta.error}</Error>}
  </Field>
);

export const Field = ({ children, ...props }) => (
  <div {...props} className={styles.Field}>
    {React.Children.map(
      children,
      (child) => (isType(child, 'Input') ? React.cloneElement(child, { className: styles.Input }) : child),
    )}
  </div>
);

export const Title = ({ children }) => <BoldText className={styles.Header}>{children}</BoldText>;

export const Description = ({ children }) => <p className={styles.Description}>{children}</p>;

export const Error = ({ children }) => (children ? <p className={styles.Error}>{children}</p> : null);

export const RadioGroup = ({ children, radioWidth, onChange, value, name }) => (
  <div className={styles.InputGroup}>
    {React.Children.map(children, (radio: React.ReactElement<any>) =>
      React.cloneElement(radio, {
        className: styles.Input,
        style: { width: radioWidth },
        onChange,
        checked: value === radio.props.value,
      }),
    )}
  </div>
);

export default Field;
