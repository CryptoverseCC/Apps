import React, { Component } from 'react';
import classnames from 'classnames/bind';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Modal from '@linkexchange/components/src/Modal';
import RootProvider from '@linkexchange/root-provider';
import { IWidgetSettings } from '@linkexchange/types/widget';
import { ILink, IRemoteLink } from '@linkexchange/types/link';
import calculateProbabilities from '@linkexchange/utils/links';
import Switch from '@linkexchange/components/src/utils/Switch';
import { throwErrorOnNotOkResponse } from '@linkexchange/utils/fetch';
import { openLinkexchangeUrl } from '@linkexchange/utils/openLinkexchangeUrl';

import Menu from './components/Menu';
import Link from './components/Link';
import NoLinks from './components/NoLinks';
import { ArrowLeft, ArrowRight } from './components/Arrows';
import RandomLinkProvider from './containers/RandomLinkProvider';
import { Provider, WidgetDatails, AddLink, Intercom } from './containers/Lazy';

import * as style from './banner.scss';

const cx = classnames.bind(style);

interface IBannerProps {
  openDetails: 'modal' | 'tab';
  widgetSettings: IWidgetSettings;
  root: HTMLElement;
}

interface IBannerState {
  fetched: boolean;
  links: ILink[];
  openedModal: 'none' | 'details' | 'addLink';
  currentLink?: ILink;
  activeArrow?: string;
}

const transitionClassNames = {
  enter: style.transitionEnter,
  enterActive: style.transitionEnterActive,
  exit: style.transitionLeave,
  exitActive: style.transitionLeaveActive,
};

const transitionLeftClassNames = {
  enter: style.transitionLeftEnter,
  enterActive: style.transitionLeftEnterActive,
  exit: style.transitionLeftLeave,
  exitActive: style.transitionLeftLeaveActive,
};

export default class Banner extends Component<IBannerProps, IBannerState> {
  linkProvider: RandomLinkProvider;
  menu: Menu;

  state: IBannerState = {
    fetched: false,
    links: [],
    openedModal: 'none',
  };

  constructor(props: IBannerProps) {
    super(props);
    this.fetchLinks();
  }

  render() {
    const { widgetSettings } = this.props;
    const { currentLink, openedModal, links = [], fetched = true, activeArrow } = this.state;
    if (!fetched) {
      return <div />;
    }

    return (
      <RootProvider root={this.props.root}>
        <div
          className={cx(['self', widgetSettings.size, activeArrow])}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <Switch expresion={fetched && !!currentLink}>
            <Switch.Case condition>
              {currentLink && (
                <TransitionGroup className={style.linkContainer}>
                  <CSSTransition
                    timeout={300}
                    key={currentLink.id}
                    classNames={activeArrow === 'left' ? transitionLeftClassNames : transitionClassNames}
                  >
                    <Link link={currentLink} className={style.link} />
                  </CSSTransition>
                </TransitionGroup>
              )}
            </Switch.Case>
            <Switch.Case condition={false}>
              <NoLinks className={style.noLinks} widgetSize={widgetSettings.size} />
            </Switch.Case>
          </Switch>
          {widgetSettings.size === 'leaderboard' && this.renderArrows()}
          <Menu ref={(ref: Menu) => (this.menu = ref)} onClick={this.openDetails} widgetSettings={widgetSettings}>
            {widgetSettings.size === 'rectangle' && this.renderArrows()}
          </Menu>
          <RandomLinkProvider
            ref={(ref: RandomLinkProvider) => (this.linkProvider = ref)}
            links={links}
            timeslot={widgetSettings.timeslot}
            onLink={this.onLink}
          />
          <Modal isOpen={openedModal !== 'none'} onCloseRequest={this.closeModal}>
            <Provider widgetSettings={widgetSettings}>
              <Switch expresion={openedModal}>
                <Switch.Case condition="details">
                  <WidgetDatails onAddLink={this.openModal('addLink')} openInNewTab={this.openInNewTab} />
                </Switch.Case>
                <Switch.Case condition="addLink">
                  <div style={{ width: '500px' }}>
                    <AddLink />
                  </div>
                </Switch.Case>
              </Switch>
              <Intercom settings={{ app_id: 'xdam3he4', ...widgetSettings }} />
            </Provider>
          </Modal>
        </div>
      </RootProvider>
    );
  }

  private renderArrows = () => (
    <div className={cx(style.arrows, { disabled: this.state.fetched && !this.state.currentLink })}>
      <ArrowLeft
        className={style.left}
        onClick={this.onPrevClick}
        onMouseEnter={this.onArrowEnter('left')}
        onMouseLeave={this.onArrowLeave}
      />
      <ArrowRight
        className={style.right}
        onClick={this.onNextClick}
        onMouseEnter={this.onArrowEnter('right')}
        onMouseLeave={this.onArrowLeave}
      />
    </div>
  );

  private fetchLinks = async () => {
    const {
      apiUrl = 'https://api.userfeeds.io',
      recipientAddress,
      asset,
      algorithm,
      whitelist,
      slots,
    } = this.props.widgetSettings;
    const recipientAddressLower = recipientAddress.toLowerCase();
    const assetLower = asset.toLowerCase();
    const rankingApiUrl = `${apiUrl}/ranking/${algorithm};asset=${assetLower};context=${recipientAddressLower}/`;
    const timedecayFilterAlgorithm = algorithm === 'links' ? 'filter_timedecay/' : '';
    const whitelistFilterAlgorithm = whitelist ? `filter_whitelist;whitelist=${whitelist.toLowerCase()}/` : '';
    const groupFilterAlgorithm = 'filter_group;sum_keys=score;sum_keys=total/';
    try {
      // tslint:disable-next-line max-line-length
      const { items: links = [] } = await fetch(
        `${rankingApiUrl}${timedecayFilterAlgorithm}${whitelistFilterAlgorithm}${groupFilterAlgorithm}`,
      )
        .then(throwErrorOnNotOkResponse)
        .then<{ items: IRemoteLink[] }>((res) => res.json());

      const linksInSlots = links.slice(0, slots);
      const linksTotalScore = linksInSlots.reduce((acc, { score }) => acc + score, 0);

      this.setState({
        fetched: true,
        links: calculateProbabilities(
          linksTotalScore === 0 ? linksInSlots : linksInSlots.filter(({ score }) => score > 0),
        ),
      });
      this.preloadModals();
    } catch (e) {
      console.info('Something went wrong 😞');
    }
  };

  private openModal = (modalName: 'none' | 'details' | 'addLink') => () => {
    this.setState({ openedModal: modalName });
  };

  private openDetails = () => {
    if (this.props.openDetails === 'modal') {
      this.setState({ openedModal: 'details' });
      AddLink.preload();
    } else {
      openLinkexchangeUrl('/direct/details', this.props.widgetSettings);
    }
  };

  private closeModal = () => {
    this.openModal('none')();
  };

  private onMouseEnter = () => {
    this.linkProvider.pause();
    this.menu.pause();
  };

  private onMouseLeave = () => {
    this.setState({ activeArrow: '' });
    this.linkProvider.resume();
    this.menu.resume();
  };

  private onArrowEnter = (activeArrow) => () => this.setState({ activeArrow });
  private onArrowLeave = () => this.setState({ activeArrow: '' });

  private onPrevClick = () => {
    this.setState({ activeArrow: 'left' }, () => {
      this.linkProvider.prev();
    });
  };

  private onNextClick = () => {
    this.setState({ activeArrow: 'right' }, () => {
      this.linkProvider.next();
    });
  };

  private openInNewTab = () => {
    openLinkexchangeUrl('/direct/details', this.props.widgetSettings);
  };

  private onLink = (currentLink: ILink, startImmediately?: boolean) => {
    this.setState({ currentLink });
    this.menu.restart(!startImmediately);
  };

  private preloadModals = () => {
    if (this.props.openDetails === 'modal') {
      Provider.preload();
      WidgetDatails.preload();
    }
  };
}
