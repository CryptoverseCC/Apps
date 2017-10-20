import React, { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import classnames from 'classnames';

import { mobileOrTablet } from '@userfeeds/utils/src/userAgent';

import Paper from '@userfeeds/apps-components/src/Paper';
import Button from '@userfeeds/apps-components/src/Button';
import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';
import Pill from '@userfeeds/apps-components/src/Pill';
import { ILink } from '@userfeeds/types/link';
import Intercom from '@userfeeds/apps-components/src/Intercom';

import { IRootState } from '../../ducks';
import { EWidgetSize } from '../../types';

import { openToast, TToastType } from '../../ducks/toast';
import { modalActions } from '../../ducks/modal';
import { web3Enabled } from '../../selectors/web3';
import { visibleLinks, whitelistedLinksCount, allLinksCount } from '../../selectors/links';

import Switch from '../../components/utils/Switch';

import SideMenu, { SideMenuItem, SideMenuItemText } from './components/SideMenu';
import DetailsLists from './components/DetailsLists';
import DetailsAccordion from './components/DetailsAccordion';
import WidgetSummary from './components/WidgetSummary';

import { openLinkexchangeUrl } from '../../utils/openLinkexchangeUrl';

import * as style from './widgetDetails.scss';
import { loadTokenDetails } from '../../ducks/widget';

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

const mapStateToProps = (state: IRootState) => {
  const { links, widget } = state;

  return {
    web3Enabled: web3Enabled(state),
    widgetSettings: widget,
    links: visibleLinks(state),
    whitelistedLinks: state.links.links,
    allLinks: links.allLinks,
    allLinksCount: allLinksCount(state),
    whitelistedLinksCount: whitelistedLinksCount(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  showAddLinkModal: () =>
    dispatch(
      modalActions.open({
        modalName: 'addLink',
      }),
    ),
  openToast(message: string, type?: TToastType) {
    dispatch(openToast(message, type));
  },
  loadTokenDetails() {
    dispatch(loadTokenDetails());
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
    this.props.loadTokenDetails();
  }

  render() {
    const {
      web3Enabled,
      widgetSettings,
      whitelistedLinks,
      allLinks,
      links,
      whitelistedLinksCount,
      allLinksCount,
      standaloneMode,
    } = this.props;
    const { viewType, mobileOrTablet } = this.state;

    return (
      <div className={classnames(style.self, this.props.className)}>
        <Intercom settings={{ app_id: 'xdam3he4', ...widgetSettings }} />
        <WidgetSummary
          openInNewWindowHidden={standaloneMode}
          widgetSettings={widgetSettings}
          web3Enabled={web3Enabled}
          onAddClick={this._onAddLinkClick}
          onOpenInSeparateWindow={this._onOpenInSeparateWindowClick}
        />
        <Switch expresion={mobileOrTablet ? 'mobile' : 'desktop'}>
          <Switch.Case condition={'mobile'}>
            <DetailsAccordion
              recipientAddress={widgetSettings.recipientAddress}
              slots={widgetSettings.slots}
              whitelistedLinksCount={whitelistedLinksCount}
              hasWhitelist={!!widgetSettings.whitelist}
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
                <SideMenuItem name="Links.Whitelist">
                  <SideMenuItemText>Whitelist</SideMenuItemText>
                  <Pill style={{ marginLeft: '10px' }}>{whitelistedLinksCount}</Pill>
                </SideMenuItem>
                <SideMenuItem name="Specification">
                  <SideMenuItemText>Specification</SideMenuItemText>
                </SideMenuItem>
                <SideMenuItem name="Userfeed">
                  <SideMenuItemText>Userfeed</SideMenuItemText>
                </SideMenuItem>
              </SideMenu>
              <DetailsLists
                web3Enabled={web3Enabled}
                initialView={viewType}
                algorithm={widgetSettings.algorithm}
                scrolledTo={this._onScrolledTo}
                ref={this._onDetailsListRef}
                asset={widgetSettings.asset}
                recipientAddress={widgetSettings.recipientAddress}
                hasWhitelist={!!widgetSettings.whitelist}
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
    openLinkexchangeUrl('apps/widgets/#/details/', this.props.widgetSettings);
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
