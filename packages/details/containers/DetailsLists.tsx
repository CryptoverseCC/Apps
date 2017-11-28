import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openToast } from '@linkexchange/toast/duck';
import { IWidgetState } from '@linkexchange/ducks/widget';

import Pill from '@linkexchange/components/src/Pill';
import Wrapper from '@linkexchange/components/src/Wrapper';

import ScrollableSectionsWithMenu, {
  Menu,
  MenuItem,
  Sections,
  Section,
} from '@linkexchange/scrollable-sections-with-menu';

import { ILinksState } from '../duck';
import { visibleLinks, whitelistedLinksCount, allLinksCount } from '../selectors/links';

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
}) => (
  <ScrollableSectionsWithMenu>
    <Menu style={{ flexBasis: '200px', minWidth: '200px' }}>
      <MenuItem>
        <span>Slots</span>
        <Pill style={{ marginLeft: '10px' }}>{widgetSettings.slots}</Pill>
      </MenuItem>
      <MenuItem>
        {hasWhitelist ? (
          <Wrapper>
            <span>Whitelist</span>
            <Pill style={{ marginLeft: '10px' }}>
              {whitelistedLinksCount}
            </Pill>
          </Wrapper>
        ) : (
          <Wrapper>
            <span>Algorithm</span>
            <Pill style={{ marginLeft: '10px' }}>{allLinksCount}</Pill>
          </Wrapper>
        )}
      </MenuItem>
      <MenuItem>
        <span>Specification</span>
      </MenuItem>
      <MenuItem>
        <span>Userfeed</span>
      </MenuItem>
    </Menu>
    <Sections>
      <Section>
        <LinksList
          label="Slots"
          asset={widgetSettings.asset}
          recipientAddress={widgetSettings.recipientAddress}
          links={links}
          onBoostSuccess={onBoostSuccess}
          onBoostError={onBoostError}
        />
      </Section>
      <Section>
        {hasWhitelist ? (
          <LinksList
            label="Whitelist"
            showProbability={false}
            asset={widgetSettings.asset}
            recipientAddress={widgetSettings.recipientAddress}
            links={whitelistedLinks}
            onBoostSuccess={onBoostSuccess}
            onBoostError={onBoostError}
          />
        ) : (
          <LinksList
            label="Algorithm"
            showProbability={false}
            asset={widgetSettings.asset}
            recipientAddress={widgetSettings.recipientAddress}
            links={allLinks}
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
        <UserfeedAddressInfo
          recipientAddress={widgetSettings.recipientAddress}
          linksNumber={allLinksCount}
        />
      </Section>
    </Sections>
  </ScrollableSectionsWithMenu>
);

const mapStateToProps = (state: { links: ILinksState, widget: IWidgetState }, props) => {
  const { links, widget } = state;

  return {
    hasWhitelist: !!widget.whitelist,
    widgetSettings: widget,
    links: visibleLinks(state),
    whitelistedLinks: state.links.links,
    allLinks: links.allLinks,
    allLinksCount: allLinksCount(state),
    whitelistedLinksCount: whitelistedLinksCount(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  onBoostSuccess: () => dispatch(openToast('Link boosted 💪', 'success')),
  onBoostError: () => dispatch(openToast('Transation rejected')),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsLists);
