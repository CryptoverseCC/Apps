import React, { Component } from 'react';
import styled from 'styled-components';

import { WidgetSettings, withWidgetSettings } from '@linkexchange/widget-settings';

import Identicon from './Identicon';

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled.p`
  color: #1b2437;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
`;

const Description = styled.p`
  max-width: 406px;
  color: #1b2437;
  font-size: 18px;
`;

interface IProps {
  widgetSettings: WidgetSettings;
}

class Header extends Component<IProps> {
  render() {
    const { widgetSettings } = this.props;
    return (
      <HeaderContainer>
        <div>
          <Identicon address={widgetSettings.recipientAddress} />
          <span>Address</span>
        </div>
        <div>
          <Title>{widgetSettings.title}</Title>
          <Description>{widgetSettings.description}</Description>
        </div>
      </HeaderContainer>
    );
  }
}

export default withWidgetSettings(Header);
