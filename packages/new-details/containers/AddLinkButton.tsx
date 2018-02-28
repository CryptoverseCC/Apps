import React from 'react';
import styled from 'styled-components';

import Icon from '@linkexchange/components/src/Icon';
import Button from '@linkexchange/components/src/NewButton';
import Tooltip from '@linkexchange/components/src/Tooltip';
import { withInjectedWeb3AndWeb3State, IWeb3State } from '@linkexchange/web3-state-provider';

const AddLink = styled(Button)`
  height: 46px;
  width: 155px;
  margin-left: auto;
  border-radius: 8px;
  font-weight: bold;
`;

const AddLinkButton = (props: { web3State: IWeb3State }) => {
  const { web3State, ...restProps } = props;
  return (
    <Tooltip text={web3State.reason}>
      <AddLink disabled={!web3State.enabled} color="primary" {...restProps}>
        <Icon name="plus" />Add new link
      </AddLink>
    </Tooltip>
  );
};

export default withInjectedWeb3AndWeb3State(AddLinkButton);
