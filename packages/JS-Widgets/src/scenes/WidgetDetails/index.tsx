import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { returntypeof } from 'react-redux-typescript';

import { IRootState } from '../../reducers';
import { ILink, TWidgetSize } from '../../types';
import { modalActions } from '../../actions/modal';
import { visibleLinks, whitelistedLinksCount, allLinksCount } from '../../selectors/links';

import web3 from '../../utils/web3';

import Switch from '../../components/utils/Switch';

import Button from '../../components/Button';
import Paper from '../../components/Paper';
import TextWithLabel from '../../components/TextWithLabel';

import AddLink from './components/AddLink';
import SideMenu from './components/SideMenu';
import DetailsList from './components/DetailsList';
import WidgetSummary from './components/WidgetSummary';

import { openUserfeedsUrl } from '../../utils/openUserfeedsUrl';

import * as style from './widgetDetails.scss';

export type TViewType = 'AddLink' | 'Userfeed' | 'Specification' | 'Links.Algorithm'
  | 'Links.Whitelist' | 'Links.Slots';

interface IWidgetDetailsState {
  viewType: TViewType;
}

const mapStateToProps = (state: IRootState) => {
  const { links, widget } = state;

  return {
    links: visibleLinks(state),
    whitelistedLinks: state.links.links,
    allLinks: links.allLinks,
    allLinksCount: allLinksCount(state),
    whitelistedLinksCount: whitelistedLinksCount(state),
    ...widget,
  };
};

const mapDispatchToProps = (dispatch) => ({
  showThankYouModal: (linkId: string) => dispatch(modalActions.open({
    modalName: 'thankYou',
    modalProps: { linkId },
  })),
});

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type IWidgetDetailsProps = typeof State2Props & typeof Dispatch2Props;

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
    { context, size, whitelistedLinks, allLinks, links, algorithm, impression, title, description,
      publisherNote, whitelist, slots, whitelistedLinksCount, allLinksCount }: IWidgetDetailsProps,
    { viewType }: IWidgetDetailsState) {

    return (
      <div class={style.self}>
        <WidgetSummary
          title={title}
          description={description}
          publisherNote={publisherNote}
          impression={impression}
          onAddClick={this._onAddLinkClick}
          onOpenInSeparateWindow={this._onOpenInSeparateWindowClick}
        />
        <div class={style.details}>
          <SideMenu
            slots={slots}
            whitelistedLinksCount={whitelistedLinksCount}
            allLinksCount={allLinksCount}
            activeItem={this.state.viewType}
            onItemClick={this._menuItemClicked}
          />
          <Switch expresion={viewType === 'AddLink'}>
            <Switch.Case condition>
              <AddLink context={context} onSuccess={this._onLinkAdded} onError={this._onLinkNotAdded} />
            </Switch.Case>
            <Switch.Case condition={false}>
              <DetailsList
                initialView={viewType}
                scrolledTo={this._onScrolledTo}
                ref={this._onDetailsListRef}
                context={context}
                size={size}
                links={links}
                whitelistedLinks={whitelistedLinks}
                allLinks={allLinks}
                allLinksCount={allLinksCount}
              />
            </Switch.Case>
          </Switch>
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
    openUserfeedsUrl('apps/widgets/#/details/', this.props);
  }

  _onAddLinkClick = () => {
    this.setState({ viewType: 'AddLink' });
  }

  _onLinkAdded = (linkId) => {
    this.props.showThankYouModal(linkId);
  }

  _onLinkNotAdded = () => {
    this.setState({ viewType: 'Links.Slots' });
  }

  _onDetailsListRef = (ref) => this.detailsListCmp = ref;
}
