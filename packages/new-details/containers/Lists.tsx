import React, { Component } from 'react';
import { inject } from 'mobx-react';
import differenceBy from 'lodash/differenceBy';

import BoostLinkComponent from '@linkexchange/boost-link';
import { ILink, IRemoteLink } from '@linkexchange/types/link';
import { withInfuraAndTokenDetails } from '@linkexchange/token-details-provider';
import { withWidgetSettings, WidgetSettings } from '@linkexchange/widget-settings';
import { withInjectedWeb3 } from '@linkexchange/utils/web3';
import Web3StateProvider from '@linkexchange/web3-state-provider';
import { withInjectedWeb3AndTokenDetails } from '@linkexchange/token-details-provider';

import LinksStore from '../linksStore';
import { ListHeaderSlots, ListHeaderOutside, LinkRow } from '../components/List';

const LinkRowWithTokenDetails = withInfuraAndTokenDetails(LinkRow);

const InjectedWeb3StateProvider = withInjectedWeb3(Web3StateProvider);
const DecoratedBoostLinkComponent = withInjectedWeb3AndTokenDetails(BoostLinkComponent);

const DefaultBoostLink = (props: { link: ILink | IRemoteLink; links: LinksStore; widgetSettings: WidgetSettings }) => {
  const { links, widgetSettings, ...restProps } = props;
  return (
    <InjectedWeb3StateProvider
      asset={widgetSettings.asset}
      render={({ enabled, reason }) => (
        <DecoratedBoostLinkComponent
          disabled={!enabled}
          disabledReason={reason}
          loadBalance
          asset={widgetSettings.asset}
          widgetSettings={widgetSettings}
          linksInSlots={links.visibleLinks}
          {...restProps}
        />
      )}
    />
  );
};

const DecoratedDefaultBoostLink = inject(({ links }) => ({ links: links as LinksStore }))(
  withWidgetSettings(DefaultBoostLink),
);

interface IProps {
  widgetSettings: WidgetSettings;
  links?: LinksStore;
}

class Lists extends Component<IProps> {
  render() {
    const { widgetSettings, links } = this.props;
    const hasWhitelist = !!widgetSettings.whitelist;
    const linksInSlots = links!.visibleLinks;
    const whitelistedLinks = differenceBy(links!.whitelistedLinks, linksInSlots, (a) => a.id);
    const allLinks = differenceBy(links!.allLinks, linksInSlots, (a) => a.id);
    const linksOutside = hasWhitelist ? whitelistedLinks : allLinks;

    return (
      <>
        <ListHeaderSlots linksCount={linksInSlots.length} slots={widgetSettings.slots} />
        {linksInSlots.map((link) => (
          <LinkRowWithTokenDetails
            key={link.id}
            asset={widgetSettings.asset}
            link={link}
            boostComponent={DecoratedDefaultBoostLink}
          />
        ))}
        <ListHeaderOutside hasWhitelist={hasWhitelist} />
        {linksOutside.map((link) => (
          <LinkRowWithTokenDetails
            key={link.id}
            asset={widgetSettings.asset}
            link={link}
            boostComponent={DecoratedDefaultBoostLink}
          />
        ))}
      </>
    );
  }
}

export default inject(({ links }) => ({ links: links as LinksStore }))(withWidgetSettings(Lists));
