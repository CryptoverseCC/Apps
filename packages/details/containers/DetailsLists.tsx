import React from 'react';
import { FormattedMessage } from 'react-intl';
import differenceBy from 'lodash/differenceBy';
import { inject, observer } from 'mobx-react';

import { WidgetSettings, withWidgetSettings } from '@linkexchange/widget-settings';
import Pill from '@linkexchange/components/src/Pill';

import ScrollableSectionsWithMenu, {
  Menu,
  MenuItem,
  Sections,
  Section,
} from '@linkexchange/scrollable-sections-with-menu';

import LinksStore from '../linksStore';

import LinksList, { IDefaultBoostLinkWrapperProps } from '../components/LinksList';
import WidgetSpecification from '../components/WidgetSpecification';
import UserfeedAddressInfo from '../components/UserfeedsAddressInfo';

interface IProps {
  links?: LinksStore;
  widgetSettings: WidgetSettings;
  onBoostSuccess?: (transationId: string) => void;
  onBoostError?: (error: any) => void;
  boostLinkComponent?: React.ComponentType<IDefaultBoostLinkWrapperProps>;
}

const DetailsLists: React.SFC<IProps> = ({
  onBoostSuccess,
  onBoostError,
  boostLinkComponent,
  links: linksStore,
  widgetSettings,
}) => {
  const hasWhitelist = !!widgetSettings.whitelist;
  const linksInSlots = linksStore!.visibleLinks;
  const whitelistedLinks = differenceBy(linksStore!.whitelistedLinks, linksInSlots, (a) => a.id);
  const allLinks = differenceBy(linksStore!.allLinks, linksInSlots, (a) => a.id);
  const allLinksCount = linksStore!.allLinks.length;
  const whitelistedLinksCount = whitelistedLinks.length;

  return (
    <ScrollableSectionsWithMenu>
      <Menu style={{ flexBasis: '200px', minWidth: '200px' }}>
        <MenuItem>
          <FormattedMessage id="sideMenu.slots" defaultMessage="Slots" />
          <Pill style={{ marginLeft: '10px' }}>{widgetSettings.slots}</Pill>
        </MenuItem>
        <MenuItem>
          {hasWhitelist ? (
            <>
              <FormattedMessage id="sideMenu.approved" defaultMessage="Approved" />
              <Pill style={{ marginLeft: '10px' }}>{whitelistedLinksCount}</Pill>
            </>
          ) : (
            <>
              <FormattedMessage id="sideMenu.algorithm" defaultMessage="Algorithm" />
              <Pill style={{ marginLeft: '10px' }}>{allLinksCount}</Pill>
            </>
          )}
        </MenuItem>
        <MenuItem>
          <FormattedMessage id="sideMenu.specification" defaultMessage="Specification" />
        </MenuItem>
        <MenuItem>
          <FormattedMessage id="sideMenu.userfeed" defaultMessage="Userfeed" />
        </MenuItem>
      </Menu>
      <Sections>
        <Section>
          <LinksList
            label={<FormattedMessage id="list.slots.title" defaultMessage="Slots" />}
            asset={widgetSettings.asset}
            links={linksInSlots}
            linksInSlots={linksInSlots}
            boostLinkComponent={boostLinkComponent}
            onBoostSuccess={onBoostSuccess}
            onBoostError={onBoostError}
          />
        </Section>
        <Section>
          {hasWhitelist ? (
            <LinksList
              label={<FormattedMessage id="list.approved.title" defaultMessage="Approved" />}
              showProbability={false}
              asset={widgetSettings.asset}
              links={whitelistedLinks}
              linksInSlots={linksInSlots}
              boostLinkComponent={boostLinkComponent}
              onBoostSuccess={onBoostSuccess}
              onBoostError={onBoostError}
            />
          ) : (
            <LinksList
              label={<FormattedMessage id="list.algorithm.title" defaultMessage="Algorithm" />}
              showProbability={false}
              asset={widgetSettings.asset}
              links={allLinks}
              linksInSlots={linksInSlots}
              boostLinkComponent={boostLinkComponent}
              onBoostSuccess={onBoostSuccess}
              onBoostError={onBoostError}
            />
          )}
        </Section>
        <Section>
          <WidgetSpecification
            size={widgetSettings.size}
            algorithm={widgetSettings.algorithm}
            asset={widgetSettings.asset}
          />
        </Section>
        <Section>
          <UserfeedAddressInfo recipientAddress={widgetSettings.recipientAddress} linksNumber={allLinksCount} />
        </Section>
      </Sections>
    </ScrollableSectionsWithMenu>
  );
};

export default inject(({ links }) => ({ links: links as LinksStore }))(withWidgetSettings(DetailsLists));
