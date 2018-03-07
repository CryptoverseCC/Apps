import React from 'react';
import { inject, observer } from 'mobx-react';
import { MemoryRouter } from 'react-router';
import { BN } from 'web3-utils';

import * as Modal from '@linkexchange/components/src/StyledComponents';
import { urlWithoutQueryIfLinkExchangeApp } from '@linkexchange/utils/locationWithoutQueryParamsIfLinkExchangeApp';
import { IWidgetSettings } from '@linkexchange/types/widget';
import core from '@userfeeds/core/src';
import { withInjectedWeb3AndWeb3State } from '../web3-state-provider';
import { resolveOnTransactionHash } from '@userfeeds/core/src/utils';
import { withInjectedWeb3AndTokenDetails } from '@linkexchange/token-details-provider';
import AddLinkForm from '@linkexchange/new-add-link/Form';
import { IWeb3Store } from '@linkexchange/web3-store';
import ActionRejected from '@linkexchange/new-add-link/ActionRejected';
import PaymentInProgress from '@linkexchange/new-add-link/PaymentInProgress';
import { toWei, MAX_VALUE_256 } from '@linkexchange/utils/balance';
import TokensAccess from '@linkexchange/new-add-link/TokensAccess';
import ConfirmationToUseTokens from '@linkexchange/new-add-link/ConfirmationToUseTokens';
import ActionSuccess from '@linkexchange/new-add-link/ActionSuccess';
import { openLinkexchangeUrl } from '@linkexchange/utils/openLinkexchangeUrl';

interface IValues {
  target: string;
  title: string;
  summary: string;
  value: string;
}
interface IApprovalProcess {
  resolve(transactionHash: string): void;
  reject(): void;
}

@inject('widgetSettingsStore', 'web3Store')
@observer
export default class AddLink extends React.Component<
  { widgetSettingsStore?: IWidgetSettings; web3Store?: IWeb3Store },
  {
    step: string;
    lastSubmitValues?: IValues;
    lastTransactionHash?: string;
    approvalProcess?: IApprovalProcess;
  }
> {
  state = {
    step: 'form',
    lastSubmitValues: undefined,
    lastTransactionHash: undefined,
    approvalProcess: undefined,
  };

  private onSubmit = async (values: IValues = this.state.lastSubmitValues!) => {
    const { approve, sendClaim, shouldApprove, decimals } = this.props.web3Store!;
    const { widgetLocation, recipientAddress } = this.props.widgetSettingsStore!;

    this.setState({ lastSubmitValues: values });
    const claim = this.createClaim({ ...values, location: widgetLocation });
    const valueInWei = toWei(values.value, decimals!);
    try {
      if (shouldApprove(valueInWei)) {
        let approvalProcess;
        const approval = new Promise((resolve, reject) => {
          approvalProcess = { resolve, reject };
        });
        this.setState({ step: 'tokensAccess', approvalProcess });
        const transactionHash = await approval;
      }
      const { promiEvent: claimRequest } = await sendClaim(claim, recipientAddress, values.value);
      this.setState({ step: 'paymentInProgress' });
      const transactionHash = await resolveOnTransactionHash(claimRequest);
      this.setState({ step: 'actionSuccess', lastTransactionHash: transactionHash });
    } catch (e) {
      this.setState({ step: 'actionRejected' });
    }
  };

  private startApproval = async (unlimitedApproval: boolean) => {
    const approvalProcess: IApprovalProcess = this.state.approvalProcess!;
    try {
      const lastSubmitValues: IValues = this.state.lastSubmitValues!;
      this.setState({ step: 'confirmationToUseTokens' });
      const weiToApprove = unlimitedApproval
        ? MAX_VALUE_256
        : toWei(lastSubmitValues.value, this.props.web3Store!.decimals!);
      const { promiEvent: approveRequest } = await this.props.web3Store!.approve(weiToApprove);
      const transactionHash = await resolveOnTransactionHash(approveRequest);
      approvalProcess.resolve(transactionHash);
    } catch (e) {
      approvalProcess.reject();
    }
  };

  private createClaim({ target, title, summary, location, ...rest }) {
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

  private goBack = () => {
    this.setState({ step: 'form' });
  };

  private showStatus = () => {
    const { widgetSettingsStore } = this.props;
    const { lastTransactionHash } = this.state;

    openLinkexchangeUrl('/direct/status', { linkId: lastTransactionHash, ...widgetSettingsStore });
  };

  private renderStep() {
    switch (this.state.step) {
      case 'form':
        return <AddLinkForm initialValues={this.state.lastSubmitValues} onSubmit={this.onSubmit} />;
      case 'paymentInProgress':
        return <PaymentInProgress />;
      case 'confirmationToUseTokens':
        return <ConfirmationToUseTokens />;
      case 'tokensAccess':
        return <TokensAccess goBack={this.goBack} startTransaction={this.startApproval} />;
      case 'actionRejected':
        return <ActionRejected retry={this.goBack} />;
      case 'actionSuccess':
        const lastSubmitValues: IValues = this.state.lastSubmitValues!;
        return (
          <ActionSuccess
            showStatus={this.showStatus}
            title={lastSubmitValues.title}
            description={lastSubmitValues.summary}
            address={lastSubmitValues.target}
            value={lastSubmitValues.value}
            currency={this.props.web3Store!.symbol}
          />
        );
      default:
        return null;
    }
  }

  render() {
    return <Modal.default>{this.renderStep()}</Modal.default>;
  }
}
