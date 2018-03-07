import React from 'react';
import styled from 'styled-components';
import flowRight from 'lodash/flowRight';

import Icon from '@linkexchange/components/src/Icon';
import Tooltip from '@linkexchange/components/src/Tooltip';
import { withWidgetSettings, WidgetSettings } from '@linkexchange/widget-settings';
import { withInjectedWeb3AndWeb3State, IWeb3State } from '@linkexchange/web3-state-provider';

const AddLink = styled.button`
  cursor: pointer;
  height: 46px;
  width: 155px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  background-color: #2149fb;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;

  :not(:disabled) {
    box-shadow: 0 10px 20px 0 rgba(38, 63, 255, 0.12);
  }

  :disabled {
    cursor: not-allowed;
    background-image: linear-gradient(to right, #ffffff, #f5f7fa);
    border: solid 1px #d9e0e7;
    color: #89939f;
  }
`;

const AddLinkButton: React.SFC<{ web3State: IWeb3State; widgetSettings: WidgetSettings }> = (props) => {
  const { web3State, widgetSettings, children, ...restProps } = props;
  const disabled = !web3State.enabled;
  return (
    <Tooltip text={web3State.reason}>
      <AddLink disabled={disabled} {...restProps}>
        {!children
          ? [
              <Icon key="icon" name={disabled ? 'warning' : 'plus'} style={{ paddingRight: '5px', fontSize: '9px' }} />,
              'Add new link',
            ]
          : children}
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
