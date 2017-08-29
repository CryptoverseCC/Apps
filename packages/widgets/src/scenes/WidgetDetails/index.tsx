import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { returntypeof } from 'react-redux-typescript';
import * as classnames from 'classnames';

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
import WidgetSummary from './components/WidgetSummary';

import { openUserfeedsUrl } from '../../utils/openUserfeedsUrl';

import * as style from './widgetDetails.scss';

export type TViewType = 'Userfeed' | 'Specification' | 'Links.Algorithm'
  | 'Links.Whitelist' | 'Links.Slots';

interface IWidgetDetailsState {
  viewType: TViewType;
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
});

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type IWidgetDetailsProps = typeof State2Props & typeof Dispatch2Props & { class: string; };

@connect(mapStateToProps, mapDispatchToProps)
export default class WidgetDetails extends Component<IWidgetDetailsProps, IWidgetDetailsState> {

  detailsListCmp: DetailsList;

  constructor(props: IWidgetDetailsProps) {
    super(props);
    this.state = {
      viewType: 'Links.Slots',
    };
  }

  render(
    { web3Enabled, widgetSettings, whitelistedLinks, allLinks, links, whitelistedLinksCount, allLinksCount }
    : IWidgetDetailsProps,
    { viewType }: IWidgetDetailsState) {

    return (
      <div class={classnames(style.self, this.props.class)}>
        <WidgetSummary
          widgetSettings={widgetSettings}
          web3Enabled={web3Enabled}
          onAddClick={this._onAddLinkClick}
          onOpenInSeparateWindow={this._onOpenInSeparateWindowClick}
        />
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
            scrolledTo={this._onScrolledTo}
            ref={this._onDetailsListRef}
            context={widgetSettings.context}
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
    openUserfeedsUrl('apps/widgets/#/details/', this.props.widgetSettings);
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
