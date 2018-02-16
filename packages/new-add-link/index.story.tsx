import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { CopyFromMM } from '@linkexchange/copy-from-mm';

import Modal from './Modal';
import { Form, Field, FormSpy } from 'react-final-form';

import { TextField, validateField } from '../components/src/Form/Field';
import Input from '@linkexchange/components/src/Form/Input';
import Button from '@linkexchange/components/src/NewButton';
import { TValidationFunc, R } from '@linkexchange/utils/validation';
import { Balance, Approved } from '@linkexchange/boost-link/components/Header';

storiesOf('Input', module)
  .addDecorator(withKnobs)
  .add('Basic', () => (
    <div style={{ width: '300px' }}>
      <Input value={text('Text', 'This is the input text')} />
    </div>
  ))
  .add('Invalid', () => (
    <div style={{ width: '300px' }}>
      <Input error={text('Error Text', 'This input has an error')} />
    </div>
  ))
  .add('WithMMButton', () => (
    <div style={{ width: '300px' }}>
      <Input
        value={text('Text', 'This is the input text')}
        error={text('Error', '')}
        append={(className) => (
          <CopyFromMM
            className={className}
            onClick={action('Copy from MM!')}
            web3State={{
              enabled: boolean('Metamask Button Enabled', true),
              reason: text('Metamask Button Disabled Reason', 'Reason'),
            }}
          />
        )}
      />
    </div>
  ))
  .add('Multiline', () => (
    <div style={{ width: '300px' }}>
      <Input value={text('Text', 'This is the input text')} error={text('Error', '')} multiline />
    </div>
  ));

storiesOf('Add Link', module)
  .addDecorator(withKnobs)
  .add('Header', () => (
    <div style={{ width: '500px' }}>
      <Modal>
        {({ Header, Body, Footer }) => (
          <React.Fragment>
            <Header>
              {({ Title, HeaderRight }) => (
                <React.Fragment>
                  <Title>Create a new link</Title>
                  <HeaderRight>
                    <Balance tokenDetails={{balanceWithDecimalPoint: '10', symbol: 'BEN'}}/>
                    <Approved tokenDetails={{balanceWithDecimalPoint: '5', symbol: 'BEN'}}/>
                  </HeaderRight>
                </React.Fragment>
              )}
            </Header>
            <Body>
              <Form
                initialValues={{
                  target: 'http://',
                  value: '0' || '',
                  unlimitedApproval: false,
                }}
                onSubmit={action('Submit Form!')}
              >
                {({ handleSubmit, invalid }) => (
                  <form onSubmit={handleSubmit}>
                    <Field title="Headline" component={TextField} name="title" />
                    <Field multiline title="Description" component={TextField} name="summary" />
                    <Field title="Link" component={TextField} name="target" />
                    <Field
                      title="Initial Fee"
                      component={TextField}
                      name="value"
                      validate={validateField([R.required, R.number, R.currencyDecimals(4)])}
                    />
                    <Button
                      size="big"
                      disabled={invalid}
                      type="submit"
                      color="primary"
                      style={{ width: '100%', marginTop: '40px' }}
                    >
                      Send
                    </Button>
                  </form>
                )}
              </Form>
            </Body>
            <Footer>
              <p
                style={{
                  color: '#A6AEB8',
                  fontFamily: 'PT Sans',
                  fontSize: '12px',
                  lineHeight: '15px',
                  textAlign: 'center',
                }}
              >
                You need to pay initial fee to be considered. Paying fee does not imply that your link will be
                displayed, as publisher has to whitelist your link.
              </p>
            </Footer>
          </React.Fragment>
        )}
      </Modal>
    </div>
  ));
