import React from 'react';
import { connect } from 'react-redux';

import BoostLinkComponent from '@linkexchange/boost-link';
import { IDefaultBoostLinkWrapperProps } from '@linkexchange/details';
import Web3StateProvider from '@linkexchange/web3-state-provider';
import { withInjectedWeb3 } from '@linkexchange/utils/web3';
import { withTokenDetails } from '@linkexchange/token-details-provider';

import { IBentynState } from '../../../ducks/bentyn';
import BlocksTillConclusionProvider from '../../../providers/BlocksTillConclusionProvider';

const DecoratedBoostLink = withInjectedWeb3(withTokenDetails(BoostLinkComponent));

interface IProps {
  startBlock: number;
  endBlock: number;
}

const BoostLink = (props: IDefaultBoostLinkWrapperProps & IProps) => {
  const { startBlock, endBlock, ...restProps } = props;
  return (
    <BlocksTillConclusionProvider
      startBlock={startBlock}
      endBlock={endBlock}
      asset={props.asset}
      render={({ enabled, reason }) => (
        <DecoratedBoostLink
          {...restProps}
          loadBalance
          disabled={!enabled}
          disabledReason={reason}
        />
      )}
    />
  );
};

const mapStateToProps = ({ bentyn }: { bentyn: IBentynState }) => ({
  startBlock: bentyn.startBlock,
  endBlock: bentyn.endBlock,
});

export default connect(mapStateToProps)(BoostLink);
