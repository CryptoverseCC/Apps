import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { returntypeof } from 'react-redux-typescript';
import * as classnames from 'classnames';

import { mobileOrTablet } from '@userfeeds/utils/src/userAgent';

import Paper from '@userfeeds/apps-components/src/Paper';
import Button from '@userfeeds/apps-components/src/Button';
import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';

import { IRootState } from '../../ducks';
import { ILink, TWidgetSize } from '../../types';

import { openToast, TToastType } from '../../ducks/toast';
import { modalActions } from '../../ducks/modal';
import { web3Enabled } from '../../selectors/web3';
import { visibleLinks, whitelistedLinksCount, allLinksCount } from '../../selectors/links';

import Switch from '../../components/utils/Switch';

import SideMenu from './components/SideMenu';
import DetailsList from './components/DetailsList';
import DetailsAccordion from './components/DetailsAccordion';
import WidgetSummary from './components/WidgetSummary';

import { openLinkexchangeUrl } from '../../utils/openLinkexchangeUrl';

import * as style from './widgetDetails.scss';
import {loadTokenDetails} from '../../ducks/widget';

export type TViewType = 'Userfeed' | 'Specification' | 'Links.Algorithm'
  | 'Links.Whitelist' | 'Links.Slots';

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
  showAddLinkModal: () => dispatch(modalActions.open({
    modalName: 'addLink',
  })),
  openToast(message: string, type?: TToastType) {
    dispatch(openToast(message, type));
  },
  loadTokenDetails() {
    dispatch(loadTokenDetails());
  },
});

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type TWidgetDetailsProps = typeof State2Props & typeof Dispatch2Props & {
  class: string;
  standaloneMode?: boolean;
};

@connect(mapStateToProps, mapDispatchToProps)
export default class WidgetDetails extends Component<TWidgetDetailsProps, IWidgetDetailsState> {

  detailsListCmp: DetailsList;

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

  render(
    { web3Enabled, widgetSettings, whitelistedLinks, allLinks, links, whitelistedLinksCount, allLinksCount,
      standaloneMode }: TWidgetDetailsProps,
    { viewType, mobileOrTablet }: IWidgetDetailsState) {

    return (
      <div class={classnames(style.self, this.props.class)}>
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
            <div class={style.details}>
              <SideMenu
                slots={widgetSettings.slots}
                whitelistedLinksCount={whitelistedLinksCount}
                hasWhitelist={!!widgetSettings.whitelist}
                allLinksCount={allLinksCount}
                activeItem={this.state.viewType}
                onItemClick={this._menuItemClicked}
              />
              <DetailsList
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

  _onDetailsListRef = (ref) => this.detailsListCmp = ref;
}
