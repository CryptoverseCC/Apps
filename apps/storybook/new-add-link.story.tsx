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

storiesOf('Add Link', module)
  .addDecorator(withKnobs)
  .add('Form', () => {
    const balance = number('balance', 1000);
    const approved = number('approved', 100);
    const minimalValue = number('minimalValue', 0);
    const currency = text('currency', 'BEN')
    const onSubmit = action('Submitted form');
    const formValidations = { title: [], summary: [], target: [], value: [] };
    return (
      <div style={{ width: '500px' }}>
        <Modal.default>
          <Modal.Header>
            <Modal.Title>Create a new link</Modal.Title>
            <Modal.HeaderRight>
              <Modal.Balance>
                <Modal.BalanceLabel>In Use:</Modal.BalanceLabel>
                <Modal.BalanceValue>{balance} {currency}</Modal.BalanceValue>
              </Modal.Balance>
              <Modal.Balance>
                <Modal.BalanceLabel>Approved:</Modal.BalanceLabel>
                <Modal.BalanceValue>{approved} {currency}</Modal.BalanceValue>
              </Modal.Balance>
            </Modal.HeaderRight>
          </Modal.Header>
          <Form
            initialValues={{
              target: 'http://',
              value: '0' || '',
            }}
            onSubmit={onSubmit}
          >
            {({ handleSubmit, pristine, invalid, submitError }) => (
              <React.Fragment>
                {submitError ||
                  (text('submitError') && <Modal.Error>{submitError || text('submitError')}</Modal.Error>)}
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
                        R.currencyDecimals(4),
                        R.greaterThan(minimalValue ? parseInt(minimalValue, 10) : 0),
                        R.lessThen(balance),
                        ...(formValidations.value || []),
                      ])}
                    />
                    <Button
                      size="big"
                      type="submit"
                      color="primary"
                      style={{ width: '100%', marginTop: '40px' }}
                    >
                      Send
                    </Button>
                  </form>
                </Modal.Body>
              </React.Fragment>
            )}
          </Form>
          <Modal.Footer>
            <Modal.FooterText>
              You need to pay initial fee to be considered. Paying fee does not imply that your link will be displayed,
              as publisher has to whitelist your link.
            </Modal.FooterText>
          </Modal.Footer>
        </Modal.default>
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
