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

@inject('widgetSettingsStore', 'web3Store', 'web3StateStore')
@observer
class AddLink extends React.Component<{ widgetSettingsStore?: IWidgetSettings }, { step: string }> {
  state = {
    step: 'form',
  };

  private onSubmit = async (values: { target: string; title: string; summary: string; value: string }) => {
    const { widgetSettingsStore } = this.props;
    const claim = this.createClaim({
      target: values.target,
      title: values.title,
      summary: values.summary,
      location: widgetSettingsStore!.widgetLocation,
    });
    const approveResult = await this.approve(values.value);
    const transferResult = await this.transfer(values.value, claim);
  };

  private createClaim({ target, title, summary, location }) {
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

  private async transfer(value, claim) {
    const transferPromise = await core.ethereum.claims.sendClaimValueTransfer(
      null,
      this.props.widgetSettingsStore!.recipientAddress,
      value,
      claim,
    );
    const transferResult = await resolveOnTransactionHash(transferPromise.promiEvent);
  }

  private async approve(value) {
    return true;
  }

  render() {
    const { step } = this.state;
    return <Modal.default>{step === 'form' && <AddLinkForm onSubmit={this.onSubmit} />}</Modal.default>;
  }
}

export default withInjectedWeb3AndTokenDetails(AddLink);
