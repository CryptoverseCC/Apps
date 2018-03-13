import React from 'react';
import styled from 'styled-components';
import flowRight from 'lodash/flowRight';

import Icon from '@linkexchange/components/src/Icon';
import Tooltip from '@linkexchange/components/src/Tooltip';
import { IWeb3Store } from '@linkexchange/web3-store';
import { IWidgetSettings } from '@linkexchange/types/widget';
import { observer, inject } from 'mobx-react';

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

const AddLinkButton: React.SFC<{
  web3Store?: IWeb3Store;
  widgetSettingsStore?: IWidgetSettings;
  [key: string]: any;
}> = inject('web3Store', 'widgetSettingsStore')(
  observer((props) => {
    const { web3Store, widgetSettingsStore, children, ...restProps } = props;
    const disabled = !web3Store.unlocked;
    return (
      <Tooltip text={web3Store.reason}>
        <AddLink disabled={disabled} {...restProps}>
          {!children
            ? [
                <Icon
                  key="icon"
                  name={disabled ? 'warning' : 'plus'}
                  style={{ paddingRight: '5px', fontSize: '9px' }}
                />,
                'Add new link',
              ]
            : children}
        </AddLink>
      </Tooltip>
    );
  }),
);

export default AddLinkButton;
