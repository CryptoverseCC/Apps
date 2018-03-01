import React, { Component } from 'react';
import styled from 'styled-components';

import { styledComponentWithProps } from '../utils';
import Icon from '@linkexchange/components/src/Icon';
import Button from '@linkexchange/components/src/NewButton';
import { WidgetSettings, withWidgetSettings } from '@linkexchange/widget-settings';
import { mobileOrTablet } from '@linkexchange/utils/userAgent';

import { ShortAddress } from './ShortAddress';
import { Columns, Column, FlexColumn } from './Columns';
import { BlackText, SmallBlackText, BlackBoldText } from './Text';
import IdenticonWithToken from './IdenticonWithToken';
import LinkexchangeDots from './Dots';
import Hr from './Hr';

const Title = styled.p`
  color: #1b2437;
  font-size: 34px;
  font-weight: bold;
  text-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
`;

const Description = BlackText;

const FilteringDescription = styled.p`
  display: inline;
  padding: 10px 0;
  color: #1b2437;
  font-size: 18px;
  color: #a6aeb8;
`;

const BoldLink = styledComponentWithProps<{}, HTMLLinkElement>(FilteringDescription.extend)`
  font-weight: bold;
  color: #000000;
  text-decoration: none;
`.withComponent('a');

const AddLinkContainer = styled.div`
  position: fixed;
  right: 30px;
  z-index: 2;
`;

const ContactPublisher = styled.button`
  margin-top: 10px;
  box-shadow: 0 9px 20px 0 rgba(38, 63, 255, 0.11);
  padding: 5px 8px;
  border: 1px solid #d9e0e7;
  border-radius: 8px;
  color: #263fff;
  font-weight: bold;
`;

const MobileWarning = styled.div`
  padding: 15px;
  border-radius: 8px;
  background-color: rgba(252, 0, 53, 0.07);
  color: #fc0035;
  line-height: 26px;
  text-align: center;
`;

interface IProps {
  addLink?: JSX.Element;
  expires?: JSX.Element;
  mobile?: boolean;
  widgetSettings: WidgetSettings;
}

class Header extends Component<IProps> {
  static defaultProps = {
    mobile: mobileOrTablet(),
  };

  render() {
    const { widgetSettings, addLink, expires, mobile } = this.props;
    const hasWhitelist = !!widgetSettings.whitelist;

    return (
      <>
        <Columns>
          <FlexColumn size={1} justifyContent="center" alignItems="center">
            <LinkexchangeDots />
          </FlexColumn>
          <FlexColumn size={4}>
            <SmallBlackText>Powered by</SmallBlackText>
            <BlackBoldText style={{ whiteSpace: 'nowrap' }}>Link Exchange</BlackBoldText>
          </FlexColumn>
          {!mobile && (
            <FlexColumn justifyContent="center">
              <div style={{ marginLeft: 'auto' }}>
                <BoldLink style={{ marginRight: '30px' }}>FAQ</BoldLink>
                <BoldLink target="_blank" href="https://app.linkexchange.io/direct/configurator">
                  Create own widget
                </BoldLink>
              </div>
            </FlexColumn>
          )}
        </Columns>
        <Columns>
          <Column />
          <Column size={11}>
            <Hr />
          </Column>
        </Columns>
        <Columns>
          {!mobile && (
            <FlexColumn size={1} justifyContent="center" alignItems="center">
              <IdenticonWithToken address={widgetSettings.recipientAddress} asset={widgetSettings.asset} />
              {!mobile && <ContactPublisher color="empty">Contact</ContactPublisher>}
            </FlexColumn>
          )}
          <FlexColumn size={!mobile ? 7 : 12}>
            {!!mobile && (
              <IdenticonWithToken
                address={widgetSettings.recipientAddress}
                asset={widgetSettings.asset}
                style={{ alignSelf: 'center' }}
              />
            )}
            <FilteringDescription>
              {hasWhitelist ? (
                <>
                  Filtered by{' '}
                  <BoldLink target="_blank" href={`https://etherscan.io/address/${widgetSettings.whitelist}`}>
                    <ShortAddress address={widgetSettings.whitelist} />
                  </BoldLink>{' '}
                  ranked by{' '}
                </>
              ) : (
                'Ranked by '
              )}
              <BoldLink
                target="_blank"
                href={`https://userfeeds-platform.readthedocs-hosted.com/en/latest/ref/algorithms.html#${
                  widgetSettings.algorithm
                }`}
              >
                Links Algorithm
              </BoldLink>
            </FilteringDescription>
            {expires}
            <Title>{widgetSettings.title}</Title>
            <Description>{widgetSettings.description}</Description>
          </FlexColumn>
          {!mobile && (
            <FlexColumn size={4} justifyContent="center">
              <AddLinkContainer>{addLink}</AddLinkContainer>
            </FlexColumn>
          )}
        </Columns>
        {mobile && (
          <Columns>
            <FlexColumn>
              <MobileWarning>
                <p style={{ fontWeight: 'bold' }}>This is preview only.</p>
                To boost links visibility or add new ones, please go to desktop browser with Metamask enabled.
              </MobileWarning>
            </FlexColumn>
          </Columns>
        )}
      </>
    );
  }
}

export default withWidgetSettings(Header);
