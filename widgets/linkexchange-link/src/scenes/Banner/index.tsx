import React, { Component } from 'react';
import classnames from 'classnames/bind';
import Loadable from 'react-loadable';

import { ILink } from '@userfeeds/types/link';
import Icon from '@linkexchange/components/src/Icon';
import Link from '@linkexchange/components/src/Link';
import Label from '@linkexchange/components/src/Label';
import { fetchLinks } from '@linkexchange/details/duck';
import Tooltip from '@linkexchange/components/src/Tooltip';
import Modal from '@linkexchange/components/src/Modal';
import TokenLogo from '@linkexchange/components/src/TokenLogo';
import { IWidgetState } from '@linkexchange/ducks/widget';

import If from '@linkexchange/components/src/utils/If';
import Switch from '@linkexchange/components/src/utils/Switch';
// import getRootModal from '@linkexchange/modal/RootModal';
// import RootToast from '@linkexchange/toast/RootToast';

import Menu from './containers/Menu';
import RandomLinkProvider from './containers/RandomLinkProvider';

import * as style from './banner.scss';

const cx = classnames.bind(style);

const Loading = (props) => {
  if (props.pastDelay) {
    return <div>Loading...</div>;
  }
  return null;
};

const LazyWidgetDatails = Loadable({
  loader: () => import('../WidgetDetails'),
  loading: Loading,
});

const LazyAddLink = Loadable({
  loader: () => import('../AddLink'),
  loading: Loading,
});

interface IBannerProps {
  widgetSettings: IWidgetState;
}

interface IBannerState {
  isAddLinkOpen?: boolean;
  isWidgetDetailsOpen?: boolean;
  currentLink?: ILink;
  optionsOpen: boolean;
}

export default class Banner extends Component<IBannerProps, IBannerState> {
  linkProvider: RandomLinkProvider;
  state: IBannerState = {
    optionsOpen: false,
  };

  constructor(props: IBannerProps) {
    super(props);
    // props.fetchLinks();
  }

  render() {
    const { widgetSettings, links = [], fetched = true } = this.props;
    const { currentLink, optionsOpen, isAddLinkOpen, isWidgetDetailsOpen } = this.state;
    if (!fetched) {
      return <div />;
    }

    return (
      <div className={cx(['self', widgetSettings.size])} onMouseLeave={this._onInfoLeave}>
        <div className={cx('options', { open: optionsOpen })}>
          <div className={style.probabilityContainer}>
            <span className={style.probabilityLabel}>Probability: </span>
            <div className={style.probability}>{currentLink && `${currentLink.probability}%`}</div>
          </div>
          <div className={style.arrows}>
            <div className={cx('arrow', 'left')} onClick={this._onPrevClick}>
              <Icon name="arrow-left" />
            </div>
            <div className={cx('arrow', 'right')} onClick={this._onNextClick}>
              <Icon name="arrow-right" />
            </div>
          </div>
          <Menu onClick={this._openWidgetDetails} />
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
          isOpen={isWidgetDetailsOpen || isAddLinkOpen}
          onCloseRequest={this._closeModal}
        >
          <If condition={isWidgetDetailsOpen}>
            <LazyWidgetDatails
              onAddLink={this._openAddLink}
              widgetSettings={widgetSettings}
            />
          </If>
          <If condition={isAddLinkOpen}>
            <LazyAddLink widgetSettings={widgetSettings} />
          </If>
        </Modal>
        {/* <RootModal /> */}
      </div>
    );
  }

  _openWidgetDetails = () => {
    this.setState({ isWidgetDetailsOpen: true });
  }

  _openAddLink = () => {
    this.setState({ isAddLinkOpen: true }); // ToDo!
  }

  _closeModal = () => {
    this.setState({ isWidgetDetailsOpen: false, isAddLinkOpen: false });
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
      window.open(this.state.currentLink.target, '_blank');
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
