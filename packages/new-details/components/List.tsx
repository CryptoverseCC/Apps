import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import moment from 'moment';

import styledComponentWithProps from '@linkexchange/utils/styledComponentsWithProps';
import { WidgetSettings } from '@linkexchange/widget-settings';
import { fromWeiToString } from '@linkexchange/utils/balance';
import { ILink, IRemoteLink, isILink } from '@linkexchange/types/link';
import { ITokenDetails } from '@linkexchange/token-details-provider';
import { mobileOrTablet } from '@linkexchange/utils/userAgent';
import BoostArrowImg from '@linkexchange/images/arrow-boost.svg';

import LinksStore from '@linkexchange/links-store';
import { Columns, Column, FlexColumn } from '@linkexchange/components/src/Columns';
import { BlackBoldText, BlueBoldText, LightGreyText } from './Text';
import Hr, { FancyHr } from './Hr';

const SmallGreenText = styled.span`
  padding-left: 20px;
  color: #09d57c;
  font-size: 12px;
  font-weight: bold;
`;

const SmallBlackText = SmallGreenText.extend`
  color: #000000;
`;

const StickyColumns = Columns.extend`
  margin-top: 40px;
  position: sticky;
  top: 0px;
  background: #ffffff;
  z-index: 1;
`;

const ListHeader: React.SFC<{ mobile?: boolean }> = ({ children, mobile }) => (
  <StickyColumns>
    <FlexColumn size={mobile ? 2 : 1} justifyContent="center">
      <FancyHr left />
    </FlexColumn>
    <FlexColumn size={mobile ? 10 : 6}>{children}</FlexColumn>
    {!mobile && (
      <FlexColumn size={2} justifyContent="center">
        <FancyHr />
      </FlexColumn>
    )}
  </StickyColumns>
);

ListHeader.defaultProps = {
  mobile: mobileOrTablet(),
};

export const ListHeaderSlots = ({ slots, linksCount }: { slots: number; linksCount: number }) => (
  <ListHeader>
    <BlackBoldText>
      In Slots <BlueBoldText style={{ paddingLeft: '20px' }}>{linksCount}</BlueBoldText>/{slots}
      <SmallGreenText style={{ paddingTop: '8px' }}>Visible in the widget</SmallGreenText>
    </BlackBoldText>
    <LightGreyText style={{ marginTop: '10px' }}>Assigned probability of being displayed</LightGreyText>
  </ListHeader>
);

export const ListHeaderOutside = ({ hasWhitelist }: { hasWhitelist: boolean }) => (
  <ListHeader>
    <BlackBoldText>
      Outside of slots <SmallBlackText style={{ paddingTop: '8px' }}>Not visible in the widget</SmallBlackText>
    </BlackBoldText>
    <LightGreyText style={{ marginTop: '10px' }}>
      {hasWhitelist ? 'Accepted by publisher, not boosted enough' : 'Not boosted enough'}
    </LightGreyText>
  </ListHeader>
);

const FlexRow = styledComponentWithProps<{ justifyContent?: string }, HTMLDivElement>(styled.div)`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.justifyContent ? props.justifyContent : '')};
`;

const LinkTitle = BlackBoldText;

const LinkTarget = styledComponentWithProps<{}, HTMLLinkElement>(BlueBoldText.extend)`
  font-weight: normal;
  text-decoration: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`.withComponent('a');

const Dot = styled.div`
  height: 8px;
  width: 8px;
  margin: 0 20px;
  border-radius: 8px;
  background-color: rgba(38, 63, 255, 0.2);
`;

const Link = ({ link, mobile }: { link: ILink | IRemoteLink; mobile?: boolean }) => (
  <>
    {mobile ? (
      <>
        <LinkTitle>{link.title}</LinkTitle>
        <LinkTarget target="_blank" href={link.target}>
          {link.target}
        </LinkTarget>
      </>
    ) : (
      <FlexRow>
        <LinkTitle>{link.title}</LinkTitle>
        <Dot />
        <LinkTarget target="_blank" href={link.target}>
          {link.target}
        </LinkTarget>
      </FlexRow>
    )}
    <LightGreyText style={{ paddingTop: '8px' }}>{link.summary}</LightGreyText>
  </>
);

const SmallLightGreyText = LightGreyText.extend`
  font-size: 14px;
`;

const LinkInfo = ({ link, tokenDetails }: { link: ILink | IRemoteLink; tokenDetails: ITokenDetails }) => (
  <>
    <SmallLightGreyText>{moment.duration(Date.now() - link.created_at).humanize()} ago</SmallLightGreyText>
    <SmallLightGreyText>
      {fromWeiToString(link.total, tokenDetails.decimals)} {tokenDetails.symbol} Total
    </SmallLightGreyText>
    <SmallLightGreyText>{link.group_count} Bids </SmallLightGreyText>
  </>
);

const Score = styledComponentWithProps<{ disabled?: boolean }, HTMLDivElement>(styled.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
  width: 60px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  border: ${(props) => (props.disabled ? 'solid 1px #d9e0e7' : '')} ;
  color: ${(props) => (props.disabled ? '#1b2437' : '#263fff')};
  background-color: ${(props) => (props.disabled ? ' #f5f7fa' : '#ffffff')};
  box-shadow: ${(props) => (!props.disabled ? '0 9px 20px 0 rgba(38, 63, 255, 0.11)' : '')};
`;

const TokenAmount = styledComponentWithProps<{ disabled?: boolean }, HTMLDivElement>(styled.span)`
  padding-top: 10px;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
  color: ${(props) => (props.disabled ? '#a6aeb8' : '#acb7f5')};
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4px);
  }
  60% {
    transform: translateY(-2px);
  }
`;

const Boost = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BoostArrow = styled.img.attrs({ src: BoostArrowImg })`
  padding: 0px 10px 10px 10px;

  ${Columns}:hover & {
    animation: ${bounce} 1.5s linear infinite;
  }
`;

export const LinkRow: React.SFC<{
  mobile?: boolean;
  link: ILink | IRemoteLink;
  tokenDetails: ITokenDetails;
  boostComponent: React.ComponentType<{ link: ILink | IRemoteLink }>;
  boostEnabled: boolean;
  lastChild?: boolean;
}> = ({ mobile, link, tokenDetails, lastChild, boostEnabled, boostComponent: BoostComponent }) => {
  const score = fromWeiToString(link.score, tokenDetails.decimals);

  return (
    <Columns style={{ paddingTop: '20px' }}>
      <FlexColumn size={mobile ? 2 : 1} alignItems="center" justifyContent="center">
        <Boost>
          <BoostComponent link={link}>
            <BoostArrow />
          </BoostComponent>
          <Score disabled={!boostEnabled}>{isILink(link) ? `${link.probability}%` : score}</Score>
          <TokenAmount disabled={!boostEnabled}>
            {score} {tokenDetails.symbol}
          </TokenAmount>
        </Boost>
      </FlexColumn>
      <FlexColumn size={mobile ? 10 : 8} justifyContent="center">
        <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Link link={link} mobile={mobile} />
          </div>
          <div
            style={{
              marginLeft: !mobile ? 'auto' : '',
              display: 'flex',
              flexDirection: mobile ? 'row' : 'column',
              justifyContent: mobile ? 'space-between' : 'center',
              flexShrink: 0,
            }}
          >
            <LinkInfo link={link} tokenDetails={tokenDetails} />
          </div>
        </div>
        {!lastChild && <Hr style={{ marginTop: '20px' }} />}
      </FlexColumn>
    </Columns>
  );
};

LinkRow.defaultProps = {
  mobile: mobileOrTablet(),
};
