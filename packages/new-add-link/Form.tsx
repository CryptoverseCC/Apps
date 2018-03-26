import React from 'react';
import { observer, inject } from 'mobx-react';
import { Field, Form } from 'react-final-form';

import * as Modal from '@linkexchange/components/src/StyledComponents';
import { TextField, validateField } from '@linkexchange/components/src/Form/Field';
import Button from '@linkexchange/components/src/NewButton';
import { R } from '@linkexchange/utils/validation';
import { IWidgetSettings } from '@linkexchange/types/widget';
import { IWeb3Store } from '@linkexchange/web3-store';

const InUse = ({ balance, currency }) => (
  <Modal.Balance>
    <Modal.BalanceLabel>In Use:</Modal.BalanceLabel>
    <Modal.BalanceValue>
      {balance} {currency}
    </Modal.BalanceValue>
  </Modal.Balance>
);

const AddLinkForm = inject(
  (
    {
      formValidationsStore,
      widgetSettingsStore,
      web3Store,
    }: { formValidationsStore: any; widgetSettingsStore: IWidgetSettings; web3Store: IWeb3Store },
    nextProps: any,
  ) => ({
    formValidations: (formValidationsStore && formValidationsStore['add-link']) || nextProps.formValidations,
    minimalValue: (widgetSettingsStore && widgetSettingsStore.minimalLinkFee) || nextProps.minimalValue,
    balance: (web3Store && web3Store.balance) || nextProps.balance,
    balanceWithDecimalPoint: (web3Store && web3Store.balanceWithDecimalPoint) || nextProps.balance,
    currency: (web3Store && web3Store.symbol) || nextProps.currency,
    decimals: (web3Store && web3Store.decimals) || nextProps.decimals,
    submitErrorText: (web3Store && web3Store.reason) || nextProps.submitErrorText,
  }),
)(
  observer(
    ({
      balance,
      balanceWithDecimalPoint,
      currency,
      decimals,
      onSubmit,
      submitErrorText,
      formValidations,
      minimalValue,
      initialValues,
    }) => (
      <>
        <Modal.Header>
          <Modal.Title>Create a new link</Modal.Title>
          <Modal.HeaderRight>
            <InUse balance={balanceWithDecimalPoint} currency={currency} />
          </Modal.HeaderRight>
        </Modal.Header>
        <Form
          initialValues={{
            target: 'http://',
            value: '0' || '',
            ...initialValues,
          }}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, pristine, invalid, submitError }) => {
            const error = submitError || submitErrorText;

            return (
              <>
                {error && <Modal.Error>{error}</Modal.Error>}
                <Modal.Body>
                  <form onSubmit={handleSubmit}>
                    <Field
                      title="Headline"
                      component={TextField}
                      name="title"
                      validate={validateField([R.required, R.maxLength(35), ...(formValidations.title || [])])}
                    />
                    <Field
                      multiline
                      title="Description"
                      component={TextField}
                      name="summary"
                      validate={validateField([R.required, R.maxLength(70), ...(formValidations.summary || [])])}
                    />
                    <Field
                      title="Link"
                      component={TextField}
                      name="target"
                      validate={validateField([R.required, R.link, ...(formValidations.target || [])])}
                    />
                    <Field
                      title="Initial Fee"
                      component={TextField}
                      name="value"
                      bold
                      currency={currency}
                      validate={validateField([
                        R.required,
                        R.number,
                        R.currencyDecimals(decimals),
                        R.greaterThan(minimalValue ? parseInt(minimalValue, 10) : 0),
                        R.lessThenCurrency(balance || 0, decimals || 0, 'Insufficient funds'),
                        ...(formValidations.value || []),
                      ])}
                    />
                    <Button
                      size="big"
                      type="submit"
                      color="primary"
                      disabled={error}
                      style={{ width: '100%', marginTop: '40px' }}
                    >
                      Send
                    </Button>
                  </form>
                </Modal.Body>
              </>
            );
          }}
        </Form>
        <Modal.Footer>
          <Modal.FooterText>
            You need to pay initial fee to be considered. Paying fee does not imply that your link will be displayed, as
            publisher has to whitelist your link.
          </Modal.FooterText>
        </Modal.Footer>
      </>
    ),
  ),
);

export default AddLinkForm;
