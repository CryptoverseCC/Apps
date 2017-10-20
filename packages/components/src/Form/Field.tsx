import React from 'react';
import classnames from 'classnames';
import BoldText from '../BoldText';
import { isType } from '@userfeeds/utils/src/index';
import * as styles from './field.scss';

export const Field = ({ children, ...props }) => (
  <div {...props} className={styles.Field}>
    {React.Children.map(
      children,
      (child) =>
        isType(child, 'Input') ? React.cloneElement(child, { className: styles.Input }) : child,
    )}
  </div>
);

export const Title = ({ children }) => <BoldText className={styles.Header}>{children}</BoldText>;

export const Description = ({ children }) => <p className={styles.Description}>{children}</p>;

export const Error = ({ children }) => <p className={styles.Error}>{children}</p>;

export const RadioGroup = ({ children, radioWidth, onChange, value, name }) => (
  <div className={styles.inputGroup}>
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
