import React, { Component } from 'react';
import { inject } from 'mobx-react';
import differenceBy from 'lodash/differenceBy';

import { withWidgetSettings, WidgetSettings } from '@linkexchange/widget-settings';

import { withInfuraAndTokenDetails } from '@linkexchange/token-details-provider';
import LinksStore from '../linksStore';
import { ListHeaderSlots, ListHeaderOutside, LinkRow } from '../components/List';

const LinkRowWithTokenDetails = withInfuraAndTokenDetails(LinkRow);

interface IProps {
  widgetSettings: WidgetSettings;
  links: LinksStore;
}

class Lists extends Component<IProps> {
  render() {
    const { widgetSettings, links } = this.props;
    const whitelistedLinks = differenceBy(links!.whitelistedLinks, links.visibleLinks, (a) => a.id);

    return (
      <>
        <ListHeaderSlots linksCount={links.visibleLinks.length} slots={widgetSettings.slots} />
        {links.visibleLinks.map((link) => <LinkRowWithTokenDetails key={link.id} link={link} />)}
        <ListHeaderOutside />
      </>
    );
  }
}

export default inject(({ links }) => ({ links: links as LinksStore }))(withWidgetSettings(Lists));
