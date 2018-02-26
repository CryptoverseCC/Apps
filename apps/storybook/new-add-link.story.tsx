import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import Modal from '@linkexchange/components/src/StyledComponents';
import AddLink, {
  AddLinkForm,
  PaymentInProgress,
  ConfirmationToUseTokens,
  ActionRejected,
  TokensAccess,
} from '@linkexchange/new-add-link/index';
import { observable } from 'mobx';
import { Provider } from 'mobx-react';
import { FormValidationsProvider } from '../../packages/root-provider';

storiesOf('Add Link', module)
  .addDecorator(withKnobs)
  .add('Flow', () => {
    const balance = number('balance', 1000);
    const minimalValue = number('minimalValue', 0);
    const currency = text('currency', 'BEN');
    const submitErrorText = text('Submit Error');
    const onSubmit = action('Submitted form');

    const formValidationsStore = observable({ 'add-link': { title: [], summary: [], target: [], value: [] } });
    const widgetSettingsStore = observable({ minimalValue });
    const web3Store = observable({ balance, currency });
    return (
      <div style={{ width: '500px' }}>
        <Provider
          web3Store={web3Store}
          formValidationsStore={formValidationsStore}
          widgetSettingsStore={widgetSettingsStore}
        >
          <AddLink onSubmit={onSubmit} />
        </Provider>
      </div>
    );
  });

storiesOf('Add Link Components', module)
  .addDecorator(withKnobs)
  .addDecorator((storyFn) => (
    <div style={{ width: '500px' }}>
      <Modal>{storyFn()}</Modal>
    </div>
  ))
  .add('Form', () => {
    const balance = number('balance', 1000);
    const minimalValue = number('minimalValue', 0);
    const currency = text('currency', 'BEN');
    const submitErrorText = text('Submit Error');
    const onSubmit = action('Submitted form');
    const formValidations = { title: [], summary: [], target: [], value: [] };
    return (
      <AddLinkForm
        formValidations={formValidations}
        minimalValue={minimalValue}
        balance={balance}
        currency={currency}
        onSubmit={onSubmit}
        submitErrorText={submitErrorText}
      />
    );
  })
  .add('Payment in progress', () => <PaymentInProgress />)
  .add('Confirmation to use tokens', () => <ConfirmationToUseTokens />)
  .add('Your transaction has been rejected', () => <ActionRejected retry={action('Retrying!')} />)
  .add('Tokens access', () => (
    <TokensAccess goBack={action('Go Back')} startTransaction={action('Start transaction')} />
  ));
