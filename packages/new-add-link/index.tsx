import React from 'react';
import * as Modal from '@linkexchange/components/src/StyledComponents';
import { Field, Form } from 'react-final-form';
import { TextField, validateField } from '@linkexchange/components/src/Form/Field';
import Button from '@linkexchange/components/src/NewButton';
import { R } from '@linkexchange/utils/validation';
import { MemoryRouter } from 'react-router';
import TransactionInProgress from '@linkexchange/components/src/TransactionInProgress';
import { inject, observer } from 'mobx-react';
import Result from '@linkexchange/components/src/Result';
import AskForAllowance from '@linkexchange/components/src/AskForAllowance';

const InUse = ({ balance, currency }) => (
  <Modal.Balance>
    <Modal.BalanceLabel>In Use:</Modal.BalanceLabel>
    <Modal.BalanceValue>
      {balance} {currency}
    </Modal.BalanceValue>
  </Modal.Balance>
);

const Approved = ({ approved, currency }) => (
  <Modal.Balance>
    <Modal.BalanceLabel>Approved:</Modal.BalanceLabel>
    <Modal.BalanceValue>
      {approved} {currency}
    </Modal.BalanceValue>
  </Modal.Balance>
);

export const PaymentInProgress = () => <TransactionInProgress>Payment in progress</TransactionInProgress>;

export const ConfirmationToUseTokens = () => (
  <TransactionInProgress>Receiving confirmation to use your tokens by our contract</TransactionInProgress>
);

export const ActionRejected = ({ retry }) => (
  <Result onClick={retry} type="failure">
    Your transaction has been rejected.
  </Result>
);

export const TokensAccess = AskForAllowance;

export const AddLinkForm = inject(({ formValidationsStore, widgetSettingsStore, web3Store }, nextProps: any) => ({
  formValidations: (formValidationsStore && formValidationsStore['add-link']) || nextProps.formValidations,
  minimalValue: (widgetSettingsStore && widgetSettingsStore.minimalValue) || nextProps.minimalValue,
  balance: (web3Store && web3Store.balance) || nextProps.balance,
  currency: (web3Store && web3Store.currency) || nextProps.currency,
}))(
  observer(({ balance, currency, onSubmit, submitErrorText, formValidations, minimalValue }) => (
    <React.Fragment>
      <Modal.Header>
        <Modal.Title>Create a new link</Modal.Title>
        <Modal.HeaderRight>
          <InUse balance={balance} currency={currency} />
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
            {(submitError || submitErrorText) && <Modal.Error>{submitError || submitErrorText}</Modal.Error>}
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
                <Button size="big" type="submit" color="primary" style={{ width: '100%', marginTop: '40px' }}>
                  Send
                </Button>
              </form>
            </Modal.Body>
          </React.Fragment>
        )}
      </Form>
      <Modal.Footer>
        <Modal.FooterText>
          You need to pay initial fee to be considered. Paying fee does not imply that your link will be displayed, as
          publisher has to whitelist your link.
        </Modal.FooterText>
      </Modal.Footer>
    </React.Fragment>
  )),
);

@inject(() => ({

}))
@observer
export default class AddLink extends React.Component<{ onSubmit: any }, { step: string }> {
  state = {
    step: 'form',
  };

  _onSubmit = (values, formValidations) => {
    const claim = this._createClaim(values);
    const token = this._getTokenAddress();
    const toPayWei = toWei(values.value, tokenDetails.decimals);

    let sendClaimPromise: Promise<{ promiEvent: PromiEvent<TransactionReceipt> }>;
    if (token) {
      sendClaimPromise = core.ethereum.claims.allowanceUserfeedsContractTokenTransfer(web3, token).then((allowance) => {
        let promise: Promise<any> = Promise.resolve(null);
        if (new BN(allowance).lte(new BN(toPayWei))) {
          promise = core.ethereum.claims
            .approveUserfeedsContractTokenTransfer(web3, token, values.unlimitedApproval ? MAX_VALUE_256 : toPayWei)
            .then(({ promiEvent }) => resolveOnTransationHash(promiEvent));
        }

        return promise.then(() =>
          core.ethereum.claims.sendClaimTokenTransfer(web3, recipientAddress, token, values.value, claim),
        );
      });
    } else {
      sendClaimPromise = core.ethereum.claims.sendClaimValueTransfer(web3, recipientAddress, values.value, claim);
    }

    sendClaimPromise.then(({ promiEvent }) => {
      promiEvent
        .on('transactionHash', (linkId) => {
          this.props.onSuccess(linkId);
        })
        .on('error', (e) => {
          this.props.onError(e.message);
        });
    });
    return sendClaimPromise;
  };

  _createClaim({ target, title, summary }) {
    const { widgetSettings } = this.props;
    const location =
      widgetSettings.location && isLinkexchangeAddres() ? widgetSettings.location : urlWithoutQueryIfLinkExchangeApp();

    return {
      type: ['link'],
      claim: { target, title, summary },
      credits: [
        {
          type: 'interface',
          value: location,
        },
      ],
    };
  }

  _getTokenAddress() {
    return this.props.asset.split(':')[1];
  }

  render() {
    const { step } = this.state;
    return <Modal.default>{step === 'form' && <AddLinkForm onSubmit={this.props.onSubmit} />}</Modal.default>;
  }
}
