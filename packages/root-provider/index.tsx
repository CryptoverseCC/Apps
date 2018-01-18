import React, { Component, StatelessComponent } from 'react';
import PropTypes from 'prop-types';
import { TValidationFunc } from '@linkexchange/utils/validation';

const FormValidationsProvider: StatelessComponent<{
  formName: string;
  render: (getFormValidations: () => { [key: string]: TValidationFunc[] }) => any;
}> = ({ formName, render }, { root }) => {
  return render(() => root.validations[formName] || {});
};

FormValidationsProvider.contextTypes = { root: PropTypes.object };

export default class RootProvider extends Component<{ root: HTMLElement }> {
  static childContextTypes = {
    root: PropTypes.object,
  };

  getChildContext() {
    return {
      root: this.props.root,
    };
  }

  render() {
    return this.props.children;
  }
}

export { FormValidationsProvider };
