import React, { Component } from 'react';
import styled from 'styled-components';

import Icon from '@linkexchange/components/src/Icon';
import Button from '@linkexchange/components/src/NewButton';
import TokenLogo from '@linkexchange/components/src/TokenLogo';
import { WidgetSettings, withWidgetSettings } from '@linkexchange/widget-settings';

import { ShortAddress } from './ShortAddress';
import { Columns, Column, FlexColumn } from './Columns';
import Identicon from './Identicon';
import Hr from './Hr';

const Title = styled.p`
  color: #1b2437;
  font-size: 34px;
  font-weight: bold;
  text-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
`;

const Description = styled.p`
  color: #1b2437;
  font-size: 18px;
`;

const FilteringDescription = styled.p`
  display: inline;
  padding: 10px 0;
  color: #1b2437;
  font-size: 18px;
  color: #a6aeb8;
`;

const Whitelist = FilteringDescription.extend`
  font-weight: bold;
  color: #000000;
  text-decoration: none;
`.withComponent('a');

const Algorithm = Whitelist;

const StyledTokenLogo = styled(TokenLogo)`
  width: 57px;
  height: 57px;
`;

const AddLink = styled(Button)`
  height: 46px;
  width: 155px;
  margin-left: auto;
  border-radius: 8px;
  font-weight: bold;
`;

const ContactPublisher = styled(Button)`
  padding: 0 !important;
  height: 46px;
  width: 155px;
  border: 1px solid #d9e0e7;
  border-radius: 8px;
  color: #a6aeb8;
  font-weight: bold;
`;

interface IProps {
  widgetSettings: WidgetSettings;
}

class Header extends Component<IProps> {
  render() {
    const { widgetSettings } = this.props;
    return (
      <>
        <Columns>
          <FlexColumn justifyContent="center" alignItems="center">
            <Identicon address={widgetSettings.recipientAddress} />
          </FlexColumn>
          <FlexColumn size={7} justifyContent="center" />
          <FlexColumn size={4} justifyContent="center">
            <ContactPublisher color="empty" style={{ marginLeft: 'auto' }}>
              Contact Publisher
            </ContactPublisher>
          </FlexColumn>
        </Columns>
        <Columns>
          <Column />
          <Column size={11}>
            <Hr />
          </Column>
        </Columns>
        <Columns>
          <FlexColumn justifyContent="center" alignItems="center">
            <StyledTokenLogo asset={widgetSettings.asset} />
          </FlexColumn>
          <FlexColumn size={7}>
            <FilteringDescription>
              Filtered by{' '}
              <Whitelist target="_blank" href={`https://etherscan.io/address/${widgetSettings.whitelist}`}>
                <ShortAddress address={widgetSettings.whitelist} />
              </Whitelist>{' '}
              ranked by{' '}
              <Algorithm
                target="_blank"
                href={`https://userfeeds-platform.readthedocs-hosted.com/en/latest/ref/algorithms.html#${
                  widgetSettings.algorithm
                }`}
              >
                Links Algorithm
              </Algorithm>
            </FilteringDescription>
            <Title>{widgetSettings.title}</Title>
            <Description>{widgetSettings.description}</Description>
          </FlexColumn>
          <FlexColumn size={4} justifyContent="center">
            <AddLink color="primary">
              <Icon name="plus" />
              Add new link
            </AddLink>
          </FlexColumn>
        </Columns>
      </>
    );
  }
}

export default withWidgetSettings(Header);
