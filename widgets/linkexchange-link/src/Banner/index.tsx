import React, { Component } from 'react';
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

import Menu from './components/Menu';
import RandomLinkProvider from './containers/RandomLinkProvider';
import { Provider, WidgetDatails, AddLink, Intercom } from './containers/Lazy';

import * as style from './banner.scss';

const cx = classnames.bind(style);

interface IBannerProps {
  widgetSettings: IWidgetSettings;
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
      <div className={cx(['self', widgetSettings.size])} onMouseLeave={this._onInfoLeave}>
        <div className={cx('options', { open: optionsOpen })}>
          <Menu onClick={this._openModal('details')} />
        </div>
        <div className={cx('container', { clickable: !!currentLink })} onClick={this._openTargetUrl}>
          <div className={style.info} onMouseEnter={this._onInfoEnter} onClick={this._onInfoEnter}>
            Sponsored with <TokenLogo className={style.icon} asset={widgetSettings.asset} />
          </div>
          <Switch expresion={fetched && !!currentLink}>
            <Switch.Case condition>
              {currentLink && <Link link={currentLink} lines={widgetSettings.size === 'rectangle' ? 8 : 2} />}
            </Switch.Case>
            <Switch.Case condition={false}>
              <Label>No ads available</Label>
            </Switch.Case>
          </Switch>
        </div>
        <RandomLinkProvider
          ref={(ref: RandomLinkProvider) => (this.linkProvider = ref)}
          links={links}
          timeslot={widgetSettings.timeslot}
          onLink={this._onLink}
        />
        <Modal
          isOpen={openedModal !== 'none'}
          onCloseRequest={this._closeModal}
        >
          <Provider widgetSettings={widgetSettings}>
            <Switch expresion={openedModal}>
              <Switch.Case condition="details">
                <WidgetDatails
                  onAddLink={this._openModal('addLink')}
                />
              </Switch.Case>
              <Switch.Case condition="addLink">
                <AddLink
                  loadBalance
                  asset={widgetSettings.asset}
                  openWidgetDetails={this._openModal('details')}
                />
              </Switch.Case>
            </Switch>
            <Intercom settings={{ app_id: 'xdam3he4', ...widgetSettings }} />
          </Provider>
        </Modal>
      </div>
    );
  }

  _fetchLinks = async () => {
    const { apiUrl = 'https://api.userfeeds.io', recipientAddress, asset, algorithm, whitelist }
      = this.props.widgetSettings;
    const rankingApiUrl =
      `${apiUrl}/ranking/${algorithm};asset=${asset.toLowerCase()};context=${recipientAddress.toLowerCase()}/`;
    const timedecayFilterAlgorithm = (algorithm === 'links') ? 'filter_timedecay/' : '';
    const whitelistFilterAlgorithm = whitelist ? `filter_whitelist;whitelist=${whitelist.toLowerCase()}/` : '';
    const groupFilterAlgorithm = 'filter_group;sum_keys=score;sum_keys=total/';
    try {
      // tslint:disable-next-line max-line-length
      const { items: links = [] } = await fetch(`${rankingApiUrl}${timedecayFilterAlgorithm}${whitelistFilterAlgorithm}${groupFilterAlgorithm}`)
          .then(throwErrorOnNotOkResponse)
          .then<{ items: IRemoteLink[]; }>((res) => res.json());
      this.setState({
        fetched: true,
        links: calculateProbabilities(links),
      });
    } catch (e) {
      console.info('Something went wrong 😞');
    }
  }

  _openModal = (modalName: 'none' | 'details' | 'addLink') => () => this.setState({ openedModal: modalName });

  _closeModal = () => {
    this._openModal('none')();
    this.setState({ optionsOpen: false });
  }

  _onInfoEnter = (e) => {
    this.setState({ optionsOpen: true });
    e.stopPropagation();
  }

  _onInfoLeave = () => {
    setTimeout(() => this.setState({ optionsOpen: false }), 200);
  }

  _openTargetUrl = () => {
    if (this.state.currentLink) {
      const linkWindow = window.open(this.state.currentLink.target, '_blank');
      linkWindow!.opener = null;
    }
  }

  _onPrevClick = () => {
    this.linkProvider.prev();
  }

  _onNextClick = () => {
    this.linkProvider.next();
  }

  _onLink = (currentLink: ILink) => {
    this.setState({ currentLink });
  }
}
