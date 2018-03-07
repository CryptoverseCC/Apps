import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames/bind';

import { ILink, IRemoteLink } from '@linkexchange/types/link';

import Link from '@linkexchange/components/src/Link';
import Label from '@linkexchange/components/src/Label';
import Modal from '@linkexchange/components/src/Modal';
import { IWidgetSettings } from '@linkexchange/types/widget';
import TokenLogo from '@linkexchange/components/src/TokenLogo';
import Switch from '@linkexchange/components/src/utils/Switch';
import { throwErrorOnNotOkResponse } from '@linkexchange/utils/fetch';
import calculateProbabilities from '@linkexchange/utils/links';
import RootProvider from '@linkexchange/root-provider';
import { openLinkexchangeUrl } from '@linkexchange/utils/openLinkexchangeUrl';

import Menu from './components/Menu';
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
  optionsOpen: boolean;
}

export default class Banner extends Component<IBannerProps, IBannerState> {
  linkProvider: RandomLinkProvider;
  state: IBannerState = {
    fetched: false,
    links: [],
    openedModal: 'none',
    optionsOpen: false,
  };

  constructor(props: IBannerProps) {
    super(props);
    this._fetchLinks();
  }

  render() {
    const { widgetSettings } = this.props;
    const { currentLink, optionsOpen, openedModal, links = [], fetched = true } = this.state;
    if (!fetched) {
      return <div />;
    }

    return (
      <RootProvider root={this.props.root}>
        <div className={cx(['self', widgetSettings.size])} onMouseLeave={this._onInfoLeave}>
          <div className={cx('options', { open: optionsOpen })}>
            <Menu onClick={this._openDetails} />
          </div>
          <div className={cx('container', { clickable: !!currentLink })} onClick={this._openTargetUrl}>
            <div className={style.info} onMouseEnter={this._onInfoEnter} onClick={this._onInfoEnter}>
              <FormattedMessage id="banner.sponsoredWith" defaultMessage="Sponsored With" />{' '}
              <TokenLogo className={style.icon} asset={widgetSettings.asset} />
            </div>
            <Switch expresion={fetched && !!currentLink}>
              <Switch.Case condition>{currentLink && <Link link={currentLink} />}</Switch.Case>
              <Switch.Case condition={false}>
                <Label>
                  <FormattedMessage id="banner.noLinks" defaultMessage="No links available" />
                </Label>
              </Switch.Case>
            </Switch>
          </div>
          <RandomLinkProvider
            ref={(ref: RandomLinkProvider) => (this.linkProvider = ref)}
            links={links}
            timeslot={widgetSettings.timeslot}
            onLink={this._onLink}
          />
          <Modal isOpen={openedModal !== 'none'} onCloseRequest={this._closeModal}>
            <Provider widgetSettings={widgetSettings}>
              <Switch expresion={openedModal}>
                <Switch.Case condition="details">
                  <WidgetDatails onAddLink={this._openModal('addLink')} />
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

  _fetchLinks = async () => {
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
      this._preloadModals();
    } catch (e) {
      console.info('Something went wrong 😞');
    }
  };

  _openModal = (modalName: 'none' | 'details' | 'addLink') => () => {
    this.setState({ openedModal: modalName });
  };

  _openDetails = () => {
    if (this.props.openDetails === 'modal') {
      this.setState({ openedModal: 'details' });
      AddLink.preload();
    } else {
      openLinkexchangeUrl('/direct/details', this.props.widgetSettings);
      this.setState({ optionsOpen: false });
    }
  };

  _closeModal = () => {
    this._openModal('none')();
    this.setState({ optionsOpen: false });
  };

  _onInfoEnter = (e) => {
    this.setState({ optionsOpen: true });
    e.stopPropagation();
  };

  _onInfoLeave = () => {
    setTimeout(() => this.setState({ optionsOpen: false }), 200);
  };

  _openTargetUrl = () => {
    if (this.state.currentLink) {
      const linkWindow = window.open(this.state.currentLink.target, '_blank');
      if (linkWindow) {
        linkWindow.opener = null;
      }
    }
  };

  _onPrevClick = () => {
    this.linkProvider.prev();
  };

  _onNextClick = () => {
    this.linkProvider.next();
  };

  _onLink = (currentLink: ILink) => {
    this.setState({ currentLink });
  };

  _preloadModals = () => {
    if (this.props.openDetails === 'modal') {
      Provider.preload();
      WidgetDatails.preload();
    }
  };
}
