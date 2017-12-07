import React from 'react';

import BoostLinkComponent from '@linkexchange/boost-link';
import { IDefaultBoostLinkWrapperProps } from '@linkexchange/details';
import { withInjectedWeb3 } from '@linkexchange/utils/web3';
import { withTokenDetails } from '@linkechange/token-details-provider';

import BlocksTillConclusionProvider from '../../../providers/BlocksTillConclusionProvider';

const DecoratedBoostLink = withInjectedWeb3(withTokenDetails(BoostLinkComponent));

const BoostLink = (props: IDefaultBoostLinkWrapperProps) => (
  <DecoratedBoostLink
    {...props}
    loadBalance
    disabled={false}
    disabledReason={''}
  />
);

export default BoostLink;
