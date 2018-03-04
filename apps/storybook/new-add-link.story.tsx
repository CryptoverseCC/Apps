import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import Modal from '@linkexchange/components/src/StyledComponents';
import AddLink from '@linkexchange/new-add-link';
import AddLinkForm from '@linkexchange/new-add-link/Form';
import PaymentInProgress from '@linkexchange/new-add-link/PaymentInProgress';
import ConfirmationToUseTokens from '@linkexchange/new-add-link/ConfirmationToUseTokens';
import ActionRejected from '@linkexchange/new-add-link/ActionRejected';
import TokensAccess from '@linkexchange/new-add-link/TokensAccess';
import { observable } from 'mobx';
import { Provider } from 'mobx-react';
import { FormValidationsProvider } from '../../packages/root-provider';
import { IWidgetSettings, EWidgetSize } from '@linkexchange/types/widget';
import { WidgetSettings } from '@linkexchange/widget-settings';
import Web3Store from '@linkexchange/web3-store';
import web3 from '@linkexchange/utils/web3';
import Erc20 from '@linkexchange/web3-store/erc20';

storiesOf('Add Link', module)
  .addDecorator(withKnobs)
  .add('Flow', () => {
    const minimalLinkFee = number('minimalLinkFee', 0);
    const location = text('Location');
    const asset = text('asset', 'ethereum');
    const recipientAddress = text('recipientAddress', '0x0000000000000000000000000000000000000000');

    const formValidationsStore = observable({ 'add-link': { title: [], summary: [], target: [], value: [] } });
    const widgetSettingsStore: IWidgetSettings = new WidgetSettings({
      minimalLinkFee,
      apiUrl: '',
      recipientAddress,
      asset,
      algorithm: '',
      size: EWidgetSize.leaderboard,
      slots: 0,
      timeslot: 0,
      location,
    });
    const web3Store = new Web3Store(web3, Erc20, { asset });
    return (
      <div style={{ width: '500px' }}>
        <Provider
          web3Store={web3Store}
          formValidationsStore={formValidationsStore}
          widgetSettingsStore={widgetSettingsStore}
        >
          <AddLink />
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
