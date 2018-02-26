import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { WidgetSettings } from '@linkexchange/widget-settings';
import { fromWeiToString } from '@linkexchange/utils/balance';
import { ILink, IRemoteLink, isILink } from '@linkexchange/types/link';
import { ITokenDetails } from '@linkexchange/token-details-provider';

import LinksStore from '../linksStore';
import { Columns, Column, FlexColumn } from './Columns';
import Hr from './Hr';

const BlackBoldText = styled.p`
  display: inline;
  font-weight: bold;
  color: #000000;
  font-size: 18px;
`;

const BlueBoldText = BlackBoldText.extend`
  color: #263fff;
`;

const LightGreyText = BlackBoldText.extend`
  color: #a6aeb8;
  font-weight: normal;
`;

const SmallGreenText = styled.p`
  display: inline;
  padding-left: 20px;
  color: #09d57c;
  font-size: 12px;
  font-weight: bold;
`;

const SmallBlackText = SmallGreenText.extend`
  color: #000000;
`;

const ListHeader: React.SFC<any> = ({ children }) => (
  <Columns style={{ marginTop: '40px' }}>
    <FlexColumn size={1} justifyContent="center">
      <Hr />
    </FlexColumn>
    <FlexColumn size={6}>{children}</FlexColumn>
    <FlexColumn size={3} justifyContent="center">
      <Hr />
    </FlexColumn>
  </Columns>
);

export const ListHeaderSlots = ({ slots, linksCount }: { slots: number; linksCount: number }) => (
  <ListHeader>
    <BlackBoldText>
      In Slots <BlueBoldText style={{ paddingLeft: '20px' }}>{linksCount}</BlueBoldText>/{slots}
      <SmallGreenText style={{ paddingTop: '8px' }}>Visible in the widget</SmallGreenText>
    </BlackBoldText>
    <LightGreyText>Assigned probability of being displayed</LightGreyText>
  </ListHeader>
);

export const ListHeaderOutside = () => (
  <ListHeader>
    <BlackBoldText>
      Outside of slots <SmallBlackText style={{ paddingTop: '8px' }}>Not visible in the widget</SmallBlackText>
    </BlackBoldText>
    <LightGreyText>Accepted by publisher, not boosted enough</LightGreyText>
  </ListHeader>
);

const Score = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
  width: 60px;
  border-radius: 25px;
  background-color: #ffffff;
  box-shadow: 0 9px 20px 0 rgba(38, 63, 255, 0.11);
  color: #263fff;
  font-size: 16px;
  font-weight: bold;
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
`;

const LinkTitle = BlackBoldText.extend`
  width: 250px;
`;

const LinkTarget = BlueBoldText.extend`
  font-weight: normal;
  padding-left: 20px;
  text-decoration: none;
`.withComponent('a');

const Dot = styled.div`
  height: 8px;
  width: 8px;
  border-radius: 8px;
  background-color: rgba(38, 63, 255, 0.2);
`;

const Link = ({ link }: { link: ILink | IRemoteLink }) => (
  <>
    <FlexRow>
      <LinkTitle>{link.title}</LinkTitle>
      <Dot />
      <LinkTarget target="_blank" href={link.target}>
        {link.target}
      </LinkTarget>
    </FlexRow>
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
      {fromWeiToString(link.total, tokenDetails.decimals)}
      {tokenDetails.symbol} Total
    </SmallLightGreyText>
    <SmallLightGreyText>{link.group_count} Bids </SmallLightGreyText>
  </>
);

export const LinkRow = ({ link, tokenDetails }: { link: ILink | IRemoteLink; tokenDetails: ITokenDetails }) => (
  <Columns>
    <FlexColumn size={1} alignItems="center" justifyContent="center">
      <Score>{isILink(link) ? `${link.probability}%` : link.score}</Score>
      {fromWeiToString(link.score, tokenDetails.decimals)}
      {tokenDetails.symbol}
    </FlexColumn>
    <FlexColumn size={6}>
      <Link link={link} />
    </FlexColumn>
    <FlexColumn size={3} alignItems="flex-end">
      <LinkInfo link={link} tokenDetails={tokenDetails} />
    </FlexColumn>
  </Columns>
);
