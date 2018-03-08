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

import { delayed } from '../utils';
import LinksStore from '@linkexchange/links-store';
import { NoLinks, Loading } from '../components/Placeholders';
import { ListHeaderSlots, ListHeaderOutside, LinkRow } from '../components/List';

const LinkRowWithTokenDetails = withInfuraAndTokenDetails(LinkRow);

const InjectedWeb3StateProvider = withInjectedWeb3(Web3StateProvider);
const DecoratedBoostLinkComponent = withInjectedWeb3AndTokenDetails(BoostLinkComponent);

const DebouncedLoading = delayed(200)(Loading);

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
  addLink?: JSX.Element;
}

class Lists extends Component<IProps> {
  render() {
    const { widgetSettings, links, addLink } = this.props;
    const hasWhitelist = !!widgetSettings.whitelist;
    const linksInSlots = links!.visibleLinks;
    const whitelistedLinks = differenceBy(links!.whitelistedLinks, linksInSlots, (a) => a.id);
    const allLinks = differenceBy(links!.allLinks, linksInSlots, (a) => a.id);
    const linksOutside = hasWhitelist ? whitelistedLinks : allLinks;
    const web3Enabled = true;

    return (
      <>
        {links!.fetching && <DebouncedLoading />}
        {links!.fetched && linksInSlots.length === 0 && linksOutside.length === 0 && <NoLinks addLink={addLink} />}
        {links!.fetched &&
          (linksInSlots.length > 0 || linksOutside.length > 0) && (
            <>
              <ListHeaderSlots linksCount={linksInSlots.length} slots={widgetSettings.slots} />
              {linksInSlots.map((link, index) => (
                <LinkRowWithTokenDetails
                  key={link.id}
                  asset={widgetSettings.asset}
                  link={link}
                  boostEnabled={web3Enabled}
                  boostComponent={DecoratedDefaultBoostLink}
                  lastChild={index === linksInSlots.length - 1}
                />
              ))}
              <ListHeaderOutside hasWhitelist={hasWhitelist} />
              {linksOutside.map((link, index) => (
                <LinkRowWithTokenDetails
                  key={link.id}
                  asset={widgetSettings.asset}
                  link={link}
                  boostEnabled={web3Enabled}
                  boostComponent={DecoratedDefaultBoostLink}
                  lastChild={index === linksOutside.length - 1}
                />
              ))}
            </>
          )}
      </>
    );
  }
}

export default inject(({ links }) => ({ links: links as LinksStore }))(withWidgetSettings(Lists));
