import React from 'react';

import BoostLinkComponent from '@linkexchange/boost-link';
import { IDefaultBoostLinkWrapperProps } from '@linkexchange/details';

import BlocksTillConclusionProvider from '../../../providers/BlocksTillConclusionProvider';

const BoostLink = (props: IDefaultBoostLinkWrapperProps) => (
  <BlocksTillConclusionProvider
    asset={props.asset}
    render={({ enabled, reason }) => (
      <BoostLinkComponent
        {...props}
        disabled={!enabled}
        disabledReason={reason}
      />
    )}
  />
);

export default BoostLink;
