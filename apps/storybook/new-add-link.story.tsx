import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';

import { Form, Field, FormSpy } from 'react-final-form';

import { TextField, validateField } from '@linkexchange/components/src/Form/Field';
import Button from '@linkexchange/components/src/NewButton';
import { R } from '@linkexchange/utils/validation';
import { Balance } from '@linkexchange/boost-link/components/Header';
import * as Modal from '@linkexchange/components/src/StyledComponents';
import Slide from '@linkexchange/components/src/Slide';
import TransactionInProgress from '@linkexchange/components/src/TransactionInProgress';
import Result from '@linkexchange/components/src/Result';
import AskForAllowance from '@linkexchange/components/src/AskForAllowance';
import { CopyFromMM } from '@linkexchange/copy-from-mm';
import AddLink from '@linkexchange/new-add-link/index';

storiesOf('Add Link', module)
  .addDecorator(withKnobs)
  .add('Form', () => {
    const balance = number('balance', 1000);
    const approved = number('approved', 100);
    const minimalValue = number('minimalValue', 0);
    const currency = text('currency', 'BEN')
    const submitErrorText = text('Submit Error')
    const onSubmit = action('Submitted form');
    const formValidations = { title: [], summary: [], target: [], value: [] };
    return (
      <div style={{ width: '500px' }}>
        <AddLink
          balance={balance}
          currency={currency}
          approved={approved}
          onSubmit={onSubmit}
          submitErrorText={submitErrorText}
          formValidations={formValidations}
          minimalValue={minimalValue}
        />
      </div>
    );
  })
  .add('Payment in progress', () => (
    <div style={{ width: '500px' }}>
      <Modal.default centered>
        <TransactionInProgress>Payment in progress</TransactionInProgress>
      </Modal.default>
    </div>
  ))
  .add('Confirmation to use tokens', () => (
    <div style={{ width: '500px' }}>
      <Modal.default centered>
        <TransactionInProgress>Receiving confirmation to use your tokens by our contract</TransactionInProgress>
      </Modal.default>
    </div>
  ))
  .add('Your transaction has been rejected', () => (
    <div style={{ width: '500px' }}>
      <Modal.default centered>
        <Result onClick={action('Retrying!')} type="failure">
          Your transaction has been rejected.
        </Result>
      </Modal.default>
    </div>
  ))
  .add('Tokens access', () => (
    <div style={{ width: '500px' }}>
      <Modal.default>
        <AskForAllowance
          goBack={action('Go Back')}
          startTransaction={action('Start transaction')}
        />
      </Modal.default>
    </div>
  ));
