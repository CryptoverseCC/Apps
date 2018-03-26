import React, { Component } from 'react';
import styled from 'styled-components';

import { mobileOrTablet } from '@linkexchange/utils/userAgent';

import LinkexchangeDots from './Dots';
import ContactPublisher from './Contact';
import { ShortAddress } from './ShortAddress';
import IdenticonWithToken from './IdenticonWithToken';
import { Columns, FlexColumn } from '@linkexchange/components/src/Columns';
import { BlackText } from './Text';
import PoweredByLinkexchange from './PoweredByLinkexchange';
import styledComponentWithProps from '@linkexchange/utils/styledComponentsWithProps';
import { IWidgetSettings } from '@linkexchange/types/widget';
import { inject } from 'mobx-react';

const Title = styled.p`
  color: #1b2437;
  font-size: 34px;
  font-weight: bold;
  text-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
`;

const Description = BlackText;

const FilteringDescription = styled.p`
  display: inline;
  padding-bottom: 10px;
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
  z-index: 2;
  width: 155px;
  height: 46px;
  margin-left: auto;
`;

const MobileWarning = styled.div`
  padding: 15px;
  border-radius: 8px;
  background-color: rgba(252, 0, 53, 0.07);
  color: #fc0035;
  line-height: 26px;
  text-align: center;
`;

const openLinkExchangeHomePage = () => window.open('https://linkexchange.io', '_blank');

interface IProps {
  addLink?: JSX.Element;
  expires?: JSX.Element;
  mobile?: boolean;
  widgetSettingsStore?: IWidgetSettings;
}

@inject('widgetSettingsStore')
export default class Header extends Component<IProps> {
  static defaultProps = {
    mobile: mobileOrTablet(),
  };

  render() {
    const {
      whitelist,
      recipientAddress,
      asset,
      contactMethod,
      algorithm,
      title,
      description,
    } = this.props.widgetSettingsStore!;
    const { addLink, expires, mobile } = this.props;
    const hasWhitelist = !!whitelist;

    return (
      <>
        <Columns>
          <FlexColumn
            size={1}
            justifyContent="center"
            alignItems="center"
            style={{ cursor: 'pointer' }}
            onClick={openLinkExchangeHomePage}
          >
            <LinkexchangeDots />
          </FlexColumn>
          <FlexColumn size={8} alignItems="flex-start">
            <PoweredByLinkexchange
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
              onClick={openLinkExchangeHomePage}
            />
          </FlexColumn>
          {!mobile && (
            <FlexColumn size={3} justifyContent="center">
              <div style={{ marginLeft: 'auto' }}>
                <BoldLink target="_blank" href="https://linkexchange.io/faq" style={{ marginRight: '30px' }}>
                  FAQ
                </BoldLink>
                <BoldLink
                  target="_blank"
                  href="https://linkexchange.io/publisher-manual.html"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Create own widget
                </BoldLink>
              </div>
            </FlexColumn>
          )}
        </Columns>
        <Columns style={{ margin: '70px 0' }}>
          {!mobile && (
            <FlexColumn size={1} justifyContent="center" alignItems="center">
              <IdenticonWithToken address={recipientAddress} asset={asset} />
              {!mobile && <ContactPublisher contactMethod={contactMethod} />}
            </FlexColumn>
          )}
          <FlexColumn size={!mobile ? 7 : 12}>
            {!!mobile && (
              <IdenticonWithToken address={recipientAddress} asset={asset} style={{ alignSelf: 'center' }} />
            )}
            <FilteringDescription>
              {hasWhitelist ? (
                <>
                  Filtered by{' '}
                  <BoldLink target="_blank" href={`https://etherscan.io/address/${whitelist}`}>
                    <ShortAddress address={whitelist!} />
                  </BoldLink>{' '}
                  ranked by{' '}
                </>
              ) : (
                'Ranked by '
              )}
              <BoldLink
                target="_blank"
                href={`https://userfeeds-platform.readthedocs-hosted.com/en/latest/ref/algorithms.html#${algorithm}`}
              >
                Links Algorithm
              </BoldLink>
            </FilteringDescription>
            <Title>{title}</Title>
            {expires}
            <Description>{description}</Description>
          </FlexColumn>
          {!mobile && (
            <FlexColumn size={4}>
              <AddLinkContainer>
                <div style={{ position: 'fixed' }}>{addLink}</div>
              </AddLinkContainer>
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
