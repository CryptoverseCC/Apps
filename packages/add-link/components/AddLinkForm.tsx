import React, { Component } from 'react';
import Web3 from 'web3';
import { BN } from 'web3-utils';
import { TransactionReceipt, PromiEvent } from 'web3/types';

import core from '@userfeeds/core/src';
import { WidgetSettings } from '@linkexchange/widget-settings';
import { resolveOnTransactionHash } from '@userfeeds/core/src/utils/index';
import { toWei, MAX_VALUE_256 } from '@linkexchange/utils/balance';
import { IBaseLink } from '@linkexchange/types/link';
import Button from '@linkexchange/components/src/NewButton';
import Checkbox from '@linkexchange/components/src/Checkbox';
import { R, TValidationFunc } from '@linkexchange/utils/validation';
import TransactionProvider from '@linkexchange/transaction-provider';
import { Title, Error, TextField, validateField } from '@linkexchange/components/src/Form/Field';
import { FormValidationsProvider } from '@linkexchange/root-provider';
import { Form, Field, FormSpy } from 'react-final-form';

import {
  isLinkexchangeAddres,
  urlWithoutQueryIfLinkExchangeApp,
} from '@linkexchange/utils/locationWithoutQueryParamsIfLinkExchangeApp';

import * as style from './addLinkForm.scss';

interface IAddLinkFormProps {
  web3: Web3;
  asset: string;
  tokenDetails: any;
  recipientAddress: string;
  minimalValue?: string;
  widgetSettings: WidgetSettings;
  onSuccess(linkId: string): void;
  onError(error: any): void;
  onChange?: (link: IBaseLink) => void;
}

export default class AddLinkForm extends Component<IAddLinkFormProps> {
  render() {
    const { tokenDetails, minimalValue } = this.props;

    return (
      <div className={style.self}>
        <FormValidationsProvider
          formName="add-link"
          render={(getFormValidations) => {
            const formValidations = getFormValidations();
            return (
              <Form
                initialValues={{
                  target: 'http://',
                  value: minimalValue || '',
                  unlimitedApproval: false,
                }}
                onSubmit={() => undefined}
                render={(formProps) => (
                  <>
                    <FormSpy
                      onChange={({ values }) =>
                        this.props.onChange &&
                        this.props.onChange({
                          title: values.title as string,
                          summary: values.summary as string,
                          target: values.target as string,
                        })
                      }
                    />
                    <Field
                      title="Headline"
                      component={TextField}
                      name="title"
                      validate={validateField([R.required, R.maxLength(35), ...(formValidations.title || [])])}
                    />
                    <Field
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
                      validate={validateField([
                        R.required,
                        R.number,
                        R.currencyDecimals(4),
                        R.greaterThan(minimalValue ? parseInt(minimalValue, 10) : 0),
                        ...(formValidations.value || []),
                      ])}
                    />
                    <TransactionProvider
                      startTransaction={() => this._onSubmit(formProps.values, formValidations.form || [])}
                      renderReady={() => (
                        <Button disabled={!formProps.valid} color="primary">
                          Create
                        </Button>
                      )}
                    />
                  </>
                )}
              />
            );
          }}
        />
      </div>
    );
  }

  _onSubmit = (values, formValidations) => {
    const { recipientAddress, web3, tokenDetails } = this.props;

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
            .then(({ promiEvent }) => resolveOnTransactionHash(promiEvent));
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
}
