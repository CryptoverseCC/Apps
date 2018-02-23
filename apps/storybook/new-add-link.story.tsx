import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import Modal from '@linkexchange/components/src/StyledComponents';
import {
  AddLinkForm,
  PaymentInProgress,
  ConfirmationToUseTokens,
  ActionRejected,
  TokensAccess,
} from '@linkexchange/new-add-link/index';
import { Provider } from 'mobx-react';

storiesOf('Add Link', module)
  .addDecorator(withKnobs)
  .addDecorator((storyFn) => (
    <div style={{ width: '500px' }}>
      <Modal>{storyFn()}</Modal>
    </div>
  ))
  .add('Form', () => {
    const balance = number('balance', 1000);
    const approved = number('approved', 100);
    const minimalValue = number('minimalValue', 0);
    const currency = text('currency', 'BEN');
    const submitErrorText = text('Submit Error');
    const onSubmit = action('Submitted form');
    const formValidations = { title: [], summary: [], target: [], value: [] };
    return (
      <Provider
        balance={balance}
        currency={currency}
        approved={approved}
        onSubmit={onSubmit}
        submitErrorText={submitErrorText}
        formValidations={formValidations}
        minimalValue={minimalValue}
      >
        <AddLinkForm />
      </Provider>
    );
  })
  .add('Payment in progress', () => <PaymentInProgress />)
  .add('Confirmation to use tokens', () => <ConfirmationToUseTokens />)
  .add('Your transaction has been rejected', () => <ActionRejected retry={action('Retrying!')} />)
  .add('Tokens access', () => (
    <TokensAccess goBack={action('Go Back')} startTransaction={action('Start transaction')} />
  ));
