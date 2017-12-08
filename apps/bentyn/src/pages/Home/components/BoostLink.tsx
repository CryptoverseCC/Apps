import React from 'react';

import BoostLinkComponent from '@linkexchange/boost-link';
import { IDefaultBoostLinkWrapperProps } from '@linkexchange/details';
import Web3StateProvider from '@linkexchange/web3-state-provider';
import { withInjectedWeb3 } from '@linkexchange/utils/web3';
import { withTokenDetails } from '@linkechange/token-details-provider';

import BlocksTillConclusionProvider from '../../../providers/BlocksTillConclusionProvider';

const DecorateWeb3StateProvider = withInjectedWeb3(Web3StateProvider);
const DecoratedBoostLink = withInjectedWeb3(withTokenDetails(BoostLinkComponent));

const BoostLink = (props: IDefaultBoostLinkWrapperProps) => (
  <DecorateWeb3StateProvider
    asset={props.asset}
    render={({ enabled, reason }) => (
      <DecoratedBoostLink
        {...props}
        loadBalance
        disabled={!enabled}
        disabledReason={reason}
      />
    )}
  />
);

export default BoostLink;
