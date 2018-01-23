import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import differenceBy from 'lodash/differenceBy';

import { openToast } from '@linkexchange/toast/duck';
import { IWidgetState } from '@linkexchange/ducks/widget';

import Pill from '@linkexchange/components/src/Pill';

import ScrollableSectionsWithMenu, {
  Menu,
  MenuItem,
  Sections,
  Section,
} from '@linkexchange/scrollable-sections-with-menu';

import { ILinksState } from '../duck';
import { visibleLinks } from '../selectors/links';

import LinksList from '../components/LinksList';
import WidgetSpecification from '../components/WidgetSpecification';
import UserfeedAddressInfo from '../components/UserfeedsAddressInfo';

const DetailsLists = ({
  hasWhitelist,
  widgetSettings,
  allLinksCount,
  whitelistedLinksCount,
  links,
  whitelistedLinks,
  allLinks,
  onBoostSuccess,
  onBoostError,
  boostLinkComponent,
}) => (
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
          recipientAddress={widgetSettings.recipientAddress}
          links={links}
          linksInSlots={links}
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
            recipientAddress={widgetSettings.recipientAddress}
            links={whitelistedLinks}
            linksInSlots={links}
            boostLinkComponent={boostLinkComponent}
            onBoostSuccess={onBoostSuccess}
            onBoostError={onBoostError}
          />
        ) : (
          <LinksList
            label={<FormattedMessage id="list.algorithm.title" defaultMessage="Algorithm" />}
            showProbability={false}
            asset={widgetSettings.asset}
            recipientAddress={widgetSettings.recipientAddress}
            links={allLinks}
            linksInSlots={links}
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

const mapStateToProps = (state: { links: ILinksState; widget: IWidgetState }, props) => {
  const { links, widget } = state;
  const linksInSlots = visibleLinks(state);
  const whitelistedLinks = differenceBy(links.links, linksInSlots, (a) => a.id);
  const allLinks = differenceBy(links.allLinks, linksInSlots, (a) => a.id);

  return {
    hasWhitelist: !!widget.whitelist,
    widgetSettings: widget,
    links: linksInSlots,
    whitelistedLinks,
    allLinks,
    allLinksCount: links.allLinks.length,
    whitelistedLinksCount: whitelistedLinks.length,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onBoostSuccess: () => dispatch(openToast('Link boosted 💪', 'success')),
  onBoostError: () => dispatch(openToast('Transation rejected')),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsLists);
