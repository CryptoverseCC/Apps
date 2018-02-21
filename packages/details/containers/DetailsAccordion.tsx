import React from 'react';
import { inject } from 'mobx-react';
import differenceBy from 'lodash/differenceBy';

import { WidgetSettings, withWidgetSettings } from '@linkexchange/widget-settings';

import LinksStore from '../linksStore';
import DetailsAccordionComponent from '../components/DetailsAccordion';

interface IProps {
  widgetSettings: WidgetSettings;
  links?: LinksStore;
}

const DetailsAccordion = ({ widgetSettings, links }: IProps) => {
  const linksInSlots = links!.visibleLinks;
  const whitelistedLinks = differenceBy(links!.whitelistedLinks, linksInSlots, (a) => a.id);
  const allLinks = differenceBy(links!.allLinks, linksInSlots, (a) => a.id);

  return (
    <DetailsAccordionComponent
      hasWhitelist={!!widgetSettings.whitelist}
      widgetSettings={widgetSettings}
      links={linksInSlots}
      whitelistedLinks={whitelistedLinks}
      allLinks={allLinks}
      allLinksCount={links!.allLinks.length}
      whitelistedLinksCount={whitelistedLinks.length}
    />
  );
};

export default inject('links')(withWidgetSettings(DetailsAccordion));
