import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { returntypeof } from 'react-redux-typescript';

import { IRootState } from './reducers';
import { ILink } from './types';
import { modalActions } from './actions/modal';

import Switch from './components/utils/switch';

import web3 from './utils/web3';

import WidgetSummary from './components/widgetSummary';
import Plus from './components/plus';
import Paper from './components/paper';
import AddLink from './components/addLink';
import Button from './components/button';
import TextWithLabel from './components/textWithLabel';
import AddNewLinkButton from './components/addNewLinkButton';

import LinksList from './linksList';

import { openUserfeedsUrl } from './utils/openUserfeedsUrl';

import * as style from './widgetDetailsModal.scss';

const ComponentMapping = {
  'AddLink': ({ context, onSuccess, onError }) => (
    <Paper style={{ alignSelf: 'center', marginLeft: '10%', padding: '10px' }}>
      <AddLink context={context} onSuccess={onSuccess} onError={onError} />
    </Paper>
  ),
  'Userfeeds': ({ context, allLinks }: IWidgetDetailsModalProps) => (
    <UserfeedAddressInfo context={context} linksNumber={allLinks.length} />
  ),
  'Specification': ({ size }: IWidgetDetailsModalProps) => (
    <WidgetSpecification size={size} />
  ),
  'Links.Slots': ({ links, context }: IWidgetDetailsModalProps) => (
    <Paper style={{ width: '95%', marginTop: '20px' }}>
      <LinksList links={links} context={context} />
    </Paper>
  ),
  'Links.Whitelist': ({ links, context }: IWidgetDetailsModalProps) => (
    <Paper style={{ width: '95%', marginTop: '20px' }}>
      <LinksList links={links} context={context} />
    </Paper>
  ),
  'Links.Algorithm': ({ allLinks, context }: IWidgetDetailsModalProps) => (
    <Paper style={{ width: '95%', marginTop: '20px' }}>
      <LinksList links={allLinks} context={context} showProbability={false} />
    </Paper>
  ),
};

type ViewType = keyof typeof ComponentMapping;

interface IWidgetDetailsModalState {
  viewType: ViewType;
}

const mapStateToProps = ({ links, widget }: IRootState) => ({
  links: links.links,
  allLinks: links.allLinks,
  ...widget,
});

const mapDispatchToProps = (dispatch) => ({
  showThankYouModal: (linkId: string) => dispatch(modalActions.open({
    modalName: 'thankYou',
    modalProps: { linkId },
  })),
});

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type IWidgetDetailsModalProps = typeof State2Props & typeof Dispatch2Props;

@connect(mapStateToProps, mapDispatchToProps)
export default class WidgetDetailsModal extends Component<IWidgetDetailsModalProps, IWidgetDetailsModalState> {

  constructor(props: IWidgetDetailsModalProps) {
    super(props);
    this.state = {
      viewType: 'Userfeeds',
    };
  }

  render(
    { context, links, algorithm, whitelist }: IWidgetDetailsModalProps,
    { viewType }: IWidgetDetailsModalState) {

    const DetailsComponent = ComponentMapping[viewType];

    return (
      <div class={style.self}>
        <WidgetSummary onAddClick={this._onAddLinkClick} />
        <div class={style.details}>
          <SideMenu activeItem={this.state.viewType} onItemClick={this._menuItemClicked} />
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

interface IWidgetSpecificationProps {
  size: string;
}

const WidgetSpecification = ({ size }: IWidgetSpecificationProps) => (
  <div style={{ flex: 1, padding: '10px' }}>
    <h2>Widget Specification</h2>
    <div class="row" style={{ justifyContent: 'space-between' }}>
      <Paper style={{ width: '45%' }}>
        <TextWithLabel label="SIZE" text={size} />
      </Paper>
      <Paper style={{ width: '45%' }}>
        <TextWithLabel label="TYPE" text="Text" />
      </Paper>
    </div>
  </div>
);

interface IUserfeedAddressInfoProps {
  context: string;
  linksNumber: number;
}

const UserfeedAddressInfo = ({ context, linksNumber }: IUserfeedAddressInfoProps) => {
  const [network, address] = context.split(':');
  const etherscanUrl = `https://${network}.etherscan.io/address/${address}`;

  return (
    <div style={{ flex: 1, padding: '10px' }}>
      <h2>Userfeeds Address</h2>
      <div class="row" style={{ justifyContent: 'space-between' }}>
        <Paper style={{ width: '45%' }}>
          <TextWithLabel label="TOTAL NUMBER OF LINKS" text={linksNumber} />
        </Paper>
        <Paper style={{ width: '45%' }}>
          <TextWithLabel label="ETHERSCAN">
            <a href={etherscanUrl} target="_blank"> See it on Etherscan</a>
          </TextWithLabel>
        </Paper>
      </div>
    </div>
  );
};

interface ISideMenuProps {
  activeItem: ViewType;
  onItemClick(name: ViewType): void;
}

const SideMenu = ({ activeItem, onItemClick }: ISideMenuProps) => {
  const notify = (name: ViewType) => (event: MouseEvent) => {
    onItemClick(name);
    event.stopImmediatePropagation();
  };

  return (
    <div class={style.summary}>
      <ul class={style.sideMenu}>
        <li
          class={activeItem.startsWith('Links') ? style.active : ''}
          onClick={notify('Links.Slots')}
        >
          Links
          <ul class={style.subMenu}>
            <li
              class={activeItem === 'Links.Slots' ? style.active : ''}
              onClick={notify('Links.Slots')}
            >
              Slots(10)
            </li>
            <li
              class={activeItem === 'Links.Whitelist' ? style.active : ''}
              onClick={notify('Links.Whitelist')}
            >
              Whitelist
            </li>
            <li
              class={activeItem === 'Links.Algorithm' ? style.active : ''}
              onClick={notify('Links.Algorithm')}
            >
              Algorithm
            </li>
          </ul>
        </li>
        <li
          class={activeItem === 'Specification' ? style.active : ''}
          onClick={notify('Specification')}
        >
          Widget Specification
        </li>
        <li
          class={activeItem === 'Userfeeds' ? style.active : ''}
          onClick={notify('Userfeeds')}
        >
          Userfeeds
        </li>
      </ul>
    </div>
  );
};
