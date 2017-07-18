import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { returntypeof } from 'react-redux-typescript';

import { IRootState } from '../../reducers';
import { ILink } from '../../types';
import { modalActions } from '../../actions/modal';
import { visibleLinks, whitelistedLinksCount, allLinksCount } from '../../selectors/links';

import web3 from '../../utils/web3';

import Switch from '../../components/utils/Switch';

import Paper from '../../components/Paper';
import AddLink from '../../components/AddLink';
import Button from '../../components/Button';
import TextWithLabel from '../../components/TextWithLabel';

import SideMenu from './components/SideMenu';
import LinksList from './components/LinksList';
import WidgetSummary from './components/WidgetSummary';
import WidgetSpecification from './components/WidgetSpecification';
import UserfeedAddressInfo from './components/UserfeedsAddressInfo';

import { openUserfeedsUrl } from '../../utils/openUserfeedsUrl';

import * as style from './style.scss';

const ComponentsMapping = {
  'AddLink': ({ context, onSuccess, onError }) => (
    <Paper style={{ alignSelf: 'center', marginLeft: '10%', padding: '10px' }}>
      <AddLink context={context} onSuccess={onSuccess} onError={onError} />
    </Paper>
  ),
  'Userfeeds': ({ context, allLinksCount }: IWidgetDetailsProps) => (
    <UserfeedAddressInfo context={context} linksNumber={allLinksCount} />
  ),
  'Specification': ({ size }: IWidgetDetailsProps) => (
    <WidgetSpecification size={size} />
  ),
  'Links.Slots': ({ links, context }: IWidgetDetailsProps) => (
    <Paper style={{ width: '100%', marginTop: '20px', marginRight: '20px' }}>
      <LinksList links={links} context={context} />
    </Paper>
  ),
  'Links.Whitelist': ({ whitelistedLinks, context }: IWidgetDetailsProps) => (
    <Paper style={{ width: '100%', marginTop: '20px', marginRight: '20px' }}>
      <LinksList links={whitelistedLinks} context={context} />
    </Paper>
  ),
  'Links.Algorithm': ({ allLinks, context }: IWidgetDetailsProps) => (
    <Paper style={{ width: '100%', marginTop: '20px', marginRight: '20px' }}>
      <LinksList links={allLinks} context={context} showProbability={false} />
    </Paper>
  ),
};

export type ViewType = keyof typeof ComponentsMapping;

interface IWidgetDetailsState {
  viewType: ViewType;
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

  constructor(props: IWidgetDetailsProps) {
    super(props);
    this.state = {
      viewType: 'Userfeeds',
    };
  }

  render(
    { context, links, algorithm, whitelist, slots, whitelistedLinksCount, allLinksCount }: IWidgetDetailsProps,
    { viewType }: IWidgetDetailsState) {

    const DetailsComponent = ComponentsMapping[viewType];

    return (
      <div class={style.self}>
        <WidgetSummary onAddClick={this._onAddLinkClick} />
        <div class={style.details}>
          <SideMenu
            slots={slots}
            whitelistedLinksCount={whitelistedLinksCount}
            allLinksCount={allLinksCount}
            activeItem={this.state.viewType}
            onItemClick={this._menuItemClicked}
          />
          <DetailsComponent {...this.props} onSuccess={this._onLinkAdded} onError={this._onLinkNotAdded} />
        </div>
      </div>
    );
  }

  _menuItemClicked = (name: ViewType) => {
    this.setState({ viewType: name });
  }

  _onOpenInSeparateWindowClick = () => {
    openUserfeedsUrl('apps/widgets/#/details/', this.props);
  }

  _onWhitelistClick = () => {
    openUserfeedsUrl('apps/links/#/whitelist/', this.props);
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
}
