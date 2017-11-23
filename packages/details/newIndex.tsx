import React, { Component, Children, ReactElement } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import classnames from 'classnames';

import { isType } from '@linkexchange/utils';
import { ILink } from '@linkexchange/types/link';
import { mobileOrTablet } from '@linkexchange/utils/userAgent';
import { openLinkexchangeUrl } from '@linkexchange/utils/openLinkexchangeUrl';

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

import { DetailsAccordion, DetailsLists } from './containers/Lists';

import WidgetSummary from './components/WidgetSummary';
import DetailsListsComponent from './components/DetailsLists';
import SideMenuComponent, { SideMenuItem, SideMenuItemText } from './components/SideMenu';

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

const mapDispatchToProps = (dispatch) => bindActionCreators({
  openToast,
  loadTokenDetails,
  fetchLinks,
}, dispatch);

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type TWidgetDetailsProps = typeof State2Props &
  typeof Dispatch2Props & {
    onAddLink(): void;
    className?: string;
    standaloneMode?: boolean;
  };

export type TViewType =
  | 'Userfeed'
  | 'Specification'
  | 'Links.Algorithm'
  | 'Links.Whitelist'
  | 'Links.Slots';

interface IDetailsState {
  viewType: TViewType;
  mobileOrTablet: boolean;
}

import * as style from './widgetDetails.scss';

class Details extends Component<TWidgetDetailsProps, IDetailsState> {
  detailsListCmp: DetailsListsComponent;

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
      children,
      className,
      widgetSettings,
      whitelistedLinks,
      allLinks,
      links,
      whitelistedLinksCount,
      allLinksCount,
      standaloneMode,
      onAddLink,
    } = this.props;
    const { viewType, mobileOrTablet } = this.state;
    const hasWhitelist = !!widgetSettings.whitelist;

    const childrenArray = Children.toArray(children);

    const header = React.cloneElement(
      childrenArray.find((c) => isType(c, 'Header')) as ReactElement<any>,
      {
        widgetSettings,
        onAddClick: onAddLink,
        openInNewWindowHidden: standaloneMode,
        onOpenInSeparateWindow: this._onOpenInSeparateWindowClick,
      },
    );
    const sideMenu = React.cloneElement(
      childrenArray.find((c) => isType(c, 'SideMenu')) as ReactElement<any>,
      {
        viewType,
        hasWhitelist,
        widgetSettings,
        allLinksCount,
        whitelistedLinksCount,
        onItemClick: this._menuItemClicked,
      },
    );
    const detailsList = React.cloneElement(
      childrenArray.find((c) => isType(c, 'List')) as ReactElement<any>,
      {
        viewType,
        mobileOrTablet,
        listRef: this._onDetailsListRef,
        scrolledTo: this._onScrolledTo,
        onBoostSuccess: this._onBoostSuccess,
        onBoostError: this._onBoostError,
      },
    );

    return (
      <div className={classnames(style.self, className)}>
        {header}
        <div className={style.details}>
          {!mobileOrTablet && sideMenu}
          {detailsList}
        </div>
      </div>
    );
  }

  _onOpenInSeparateWindowClick = () => {
    openLinkexchangeUrl('apps/#/details/', this.props.widgetSettings);
  }

  _menuItemClicked = (name: TViewType) => {
    this.setState({ viewType: name }, () => {
      this.detailsListCmp.scrollTo(name);
    });
  }

  _onScrolledTo = (name: TViewType) => {
    this.setState({ viewType: name });
  }

  _onBoostSuccess = () => {
    this.props.openToast('Link boosted 💪', 'success');
  }

  _onBoostError = () => {
    this.props.openToast('Transation rejected');
  }

  _onDetailsListRef = (ref) => (this.detailsListCmp = ref.getWrappedInstance());
}

const ConnectedDetails = connect(mapStateToProps, mapDispatchToProps)(Details);
export { ConnectedDetails as Details };

interface IHeaderProps {
  displayName?: string;
  standaloneMode: boolean;
  widgetSettings: IWidgetState;
  onAddLink(): void;
  onOpenInSeparateWindow(): void;
}

export const Header: React.SFC<IHeaderProps> =
  ({ standaloneMode, widgetSettings, onAddLink, onOpenInSeparateWindow }) => (
  <WidgetSummary
    openInNewWindowHidden={standaloneMode}
    widgetSettings={widgetSettings}
    onAddClick={onAddLink}
    onOpenInSeparateWindow={onOpenInSeparateWindow}
  />
);

Header.defaultProps = {
  displayName: 'Header',
};

interface ISideMenuProps {
  displayName?: string;
  viewType: TViewType;
  onItemClick(): void;
  widgetSettings: IWidgetState;
  hasWhitelist: boolean;
  allLinksCount: number;
  whitelistedLinksCount: number;
}

export const SideMenu: React.SFC<ISideMenuProps> =
  ({ viewType, onItemClick, widgetSettings, hasWhitelist, allLinksCount, whitelistedLinksCount }) => (
  <SideMenuComponent
    activeItem={viewType}
    onItemClick={onItemClick}
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
  </SideMenuComponent>
);

SideMenu.defaultProps = {
  displayName: 'SideMenu',
};

interface IDetailsListProps {
  displayName?: string;
  hasWhitelist: boolean;
  viewType: TViewType;
  scrolledTo(to: TViewType): void;
  onBoostSuccess(): void;
  onBoostError(): void;
  mobileOrTablet: boolean;
  listRef(ref: DetailsListsComponent): void;
}

export const List: React.SFC<IDetailsListProps> = ({ hasWhitelist, viewType, scrolledTo,
  onBoostSuccess, onBoostError, listRef, mobileOrTablet }) => {
  return (
    <Switch expresion={mobileOrTablet ? 'mobile' : 'desktop'}>
      <Switch.Case condition={'mobile'}>
        <DetailsAccordion
          hasWhitelist={hasWhitelist}
        />
      </Switch.Case>
      <Switch.Case condition={'desktop'}>
        <DetailsLists
          ref={listRef}
          initialView={viewType}
          scrolledTo={scrolledTo}
          hasWhitelist={hasWhitelist}
          onBoostSuccess={onBoostSuccess}
          onBoostError={onBoostError}
        />
      </Switch.Case>
    </Switch>
  );
};

List.defaultProps = {
  displayName: 'List',
};
