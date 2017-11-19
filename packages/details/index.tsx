import React, { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import classnames from 'classnames';

import { ILink } from '@userfeeds/types/link';
import { mobileOrTablet } from '@userfeeds/utils/src/userAgent';
import { openLinkexchangeUrl } from '@userfeeds/utils/src/openLinkexchangeUrl';

import Pill from '@linkexchange/components/src/Pill';
import Paper from '@linkexchange/components/src/Paper';
import Button from '@linkexchange/components/src/Button';
import Intercom from '@linkexchange/components/src/Intercom';
import Switch from '@linkexchange/components/src/utils/Switch';
import { openToast, TToastType } from '@linkexchange/toast/duck';
import TextWithLabel from '@linkexchange/components/src/TextWithLabel';

import { IWidgetState } from '@linkexchange/ducks/widget';
import { loadTokenDetails } from '@linkechange/token-details-provider/duck';

import { fetchLinks, ILinksState } from './duck';
import { visibleLinks, whitelistedLinksCount, allLinksCount } from './selectors/links';

import DetailsLists from './components/DetailsLists';
import WidgetSummary from './components/WidgetSummary';
import DetailsAccordion from './components/DetailsAccordion';
import SideMenu, { SideMenuItem, SideMenuItemText } from './components/SideMenu';

import * as style from './widgetDetails.scss';

export type TViewType =
  | 'Userfeed'
  | 'Specification'
  | 'Links.Algorithm'
  | 'Links.Whitelist'
  | 'Links.Slots';

interface IWidgetDetailsState {
  viewType: TViewType;
  mobileOrTablet: boolean;
}

const mapStateToProps = (state: { links: ILinksState, widget: IWidgetState }) => {
  const { links, widget } = state;

  return {
    widgetSettings: widget,
    links: visibleLinks(state),
    whitelistedLinks: state.links.links,
    allLinks: links.allLinks,
    allLinksCount: allLinksCount(state),
    whitelistedLinksCount: whitelistedLinksCount(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  showAddLinkModal() {
    // dispatch(
    //   modalActions.open({
    //     modalName: 'addLink',
    //   }),
    // )
  },
  openToast(message: string, type?: TToastType) {
    dispatch(openToast(message, type));
  },
  loadTokenDetails() {
    dispatch(loadTokenDetails());
  },
  fetchLinks() {
    dispatch(fetchLinks());
  },
});

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type TWidgetDetailsProps = typeof State2Props &
  typeof Dispatch2Props & {
    className?: string;
    standaloneMode?: boolean;
  };

class WidgetDetails extends Component<TWidgetDetailsProps, IWidgetDetailsState> {
  detailsListCmp: DetailsLists;

  constructor(props: TWidgetDetailsProps) {
    super(props);
    this.state = {
      viewType: 'Links.Slots',
      mobileOrTablet: mobileOrTablet(),
    };
  }

  componentDidMount() {
    this.props.fetchLinks();
    this.props.loadTokenDetails();
  }

  render() {
    const {
      widgetSettings,
      whitelistedLinks,
      allLinks,
      links,
      whitelistedLinksCount,
      allLinksCount,
      standaloneMode,
    } = this.props;
    const { viewType, mobileOrTablet } = this.state;
    const hasWhitelist = !!widgetSettings.whitelist;

    return (
      <div className={classnames(style.self, this.props.className)}>
        <Intercom settings={{ app_id: 'xdam3he4', ...widgetSettings }} />
        <WidgetSummary
          openInNewWindowHidden={standaloneMode}
          widgetSettings={widgetSettings}
          onAddClick={this._onAddLinkClick}
          onOpenInSeparateWindow={this._onOpenInSeparateWindowClick}
        />
        <Switch expresion={mobileOrTablet ? 'mobile' : 'desktop'}>
          <Switch.Case condition={'mobile'}>
            <DetailsAccordion
              recipientAddress={widgetSettings.recipientAddress}
              slots={widgetSettings.slots}
              asset={widgetSettings.asset}
              whitelistedLinksCount={whitelistedLinksCount}
              hasWhitelist={hasWhitelist}
              allLinksCount={allLinksCount}
              size={widgetSettings.size}
              links={links}
              whitelistedLinks={whitelistedLinks}
              allLinks={allLinks}
            />
          </Switch.Case>
          <Switch.Case condition={'desktop'}>
            <div className={style.details}>
              <SideMenu
                activeItem={this.state.viewType}
                onItemClick={this._menuItemClicked}
                className={style.sideMenu}
              >
                <SideMenuItem name="Links.Slots">
                  <SideMenuItemText>Slots</SideMenuItemText>
                  <Pill style={{ marginLeft: '10px' }}>{widgetSettings.slots}</Pill>
                </SideMenuItem>
                {hasWhitelist ? (
                  <SideMenuItem name="Links.Whitelist">
                    <SideMenuItemText>Whitelist</SideMenuItemText>
                    <Pill style={{ marginLeft: '10px' }}>{whitelistedLinksCount}</Pill>
                  </SideMenuItem>
                ) : (
                  <SideMenuItem name="Links.Algorithm">
                    <SideMenuItemText>Algorithm</SideMenuItemText>
                    <Pill style={{ marginLeft: '10px' }}>{allLinksCount}</Pill>
                  </SideMenuItem>
                )}
                <SideMenuItem name="Specification">
                  <SideMenuItemText>Specification</SideMenuItemText>
                </SideMenuItem>
                <SideMenuItem name="Userfeed">
                  <SideMenuItemText>Userfeed</SideMenuItemText>
                </SideMenuItem>
              </SideMenu>
              <DetailsLists
                initialView={viewType}
                algorithm={widgetSettings.algorithm}
                scrolledTo={this._onScrolledTo}
                ref={this._onDetailsListRef}
                asset={widgetSettings.asset}
                recipientAddress={widgetSettings.recipientAddress}
                hasWhitelist={hasWhitelist}
                size={widgetSettings.size}
                links={links}
                whitelistedLinks={whitelistedLinks}
                allLinks={allLinks}
                allLinksCount={allLinksCount}
                onBoostSuccess={this._onBoostSuccess}
                onBoostError={this._onBoostError}
              />
            </div>
          </Switch.Case>
        </Switch>
      </div>
    );
  }

  _menuItemClicked = (name: TViewType) => {
    this.setState({ viewType: name }, () => {
      this.detailsListCmp.scrollTo(name);
    });
  }

  _onScrolledTo = (name: TViewType) => {
    this.setState({ viewType: name });
  }

  _onOpenInSeparateWindowClick = () => {
    openLinkexchangeUrl('apps/#/details/', this.props.widgetSettings);
  }

  _onAddLinkClick = () => {
    this.props.showAddLinkModal();
  }

  _onBoostSuccess = () => {
    this.props.openToast('Link boosted 💪', 'success');
  }

  _onBoostError = () => {
    this.props.openToast('Transation rejected');
  }

  _onDetailsListRef = (ref) => (this.detailsListCmp = ref);
}

export default connect(mapStateToProps, mapDispatchToProps)(WidgetDetails);
