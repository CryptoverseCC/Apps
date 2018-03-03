import React from 'react';
import styled from 'styled-components';
import flowRight from 'lodash/flowRight';

import Icon from '@linkexchange/components/src/Icon';
import Button from '@linkexchange/components/src/NewButton';
import Tooltip from '@linkexchange/components/src/Tooltip';
import { withWidgetSettings, WidgetSettings } from '@linkexchange/widget-settings';
import { withInjectedWeb3AndWeb3State, IWeb3State } from '@linkexchange/web3-state-provider';

const AddLink = styled(Button)`
  height: 46px;
  width: 155px;
  border-radius: 8px;
  font-weight: bold;
`;

const AddLinkButton = (props: { web3State: IWeb3State; widgetSettings: WidgetSettings }) => {
  const { web3State, widgetSettings, ...restProps } = props;
  return (
    <Tooltip text={web3State.reason}>
      <AddLink disabled={!web3State.enabled} color="primary" {...restProps}>
        <Icon name="plus" />Add new link
      </AddLink>
    </Tooltip>
  );
};

// Move to utils and add types
const propsMapper = (mapper: (props) => any) => (Cmp) => (props) => <Cmp {...props} {...mapper(props)} />;

export default flowRight(
  withWidgetSettings,
  propsMapper(({ widgetSettings }: { widgetSettings: WidgetSettings }) => ({
    asset: widgetSettings.asset,
  })),
  withInjectedWeb3AndWeb3State,
)(AddLinkButton);
