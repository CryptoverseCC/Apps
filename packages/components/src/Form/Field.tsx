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

export const TextField = (props) => {
  const { onChange, ...restInputProps } = props.input;

  return (
    <Field>
      <Title active={props.meta.active}>{props.title}</Title>
      <Input
        onChange={(e) => onChange(e)}
        {...restInputProps}
        error={props.meta.error}
        showStatus={props.meta.touched}
        type="text"
        bold={props.bold}
        primary={props.primary}
        currency={props.currency}
        isActive={props.meta.active}
        multiline={props.multiline}
        append={props.append}
      />
    </Field>
  );
};

export const Field = ({ children, ...props }) => (
  <div {...props} className={styles.Field}>
    {React.Children.map(
      children,
      (child) => (isType(child, 'Input') ? React.cloneElement(child, { className: styles.Input }) : child),
    )}
  </div>
);

export const Title = ({ children, active = false }) => (
  <span style={{ color: active ? '#263FFF' : undefined }} className={styles.Header}>
    {children}
  </span>
);

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
