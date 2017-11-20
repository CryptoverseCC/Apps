import React, { Component } from 'react';
import classnames from 'classnames/bind';

import { ILink } from '@userfeeds/types/link';
import Icon from '@linkexchange/components/src/Icon';
import Link from '@linkexchange/components/src/Link';
import Label from '@linkexchange/components/src/Label';
import Modal from '@linkexchange/components/src/Modal';
import { fetchLinks } from '@linkexchange/details/duck';
import { IWidgetState } from '@linkexchange/ducks/widget';
import Tooltip from '@linkexchange/components/src/Tooltip';
import TokenLogo from '@linkexchange/components/src/TokenLogo';
import Switch from '@linkexchange/components/src/utils/Switch';

import Menu from './containers/Menu';
import RandomLinkProvider from './containers/RandomLinkProvider';
import { Provider, WidgetDatails, AddLink } from './containers/Lazy';

import * as style from './banner.scss';

const cx = classnames.bind(style);

interface IBannerProps {
  widgetSettings: IWidgetState;
}

interface IBannerState {
  openedModal: 'none' | 'details' | 'addLink';
  currentLink?: ILink;
  optionsOpen: boolean;
}

export default class Banner extends Component<IBannerProps, IBannerState> {
  linkProvider: RandomLinkProvider;
  state: IBannerState = {
    openedModal: 'none',
    optionsOpen: false,
  };

  constructor(props: IBannerProps) {
    super(props);
    // props.fetchLinks();
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
          onCloseRequest={this._openModal('none')}
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
                  openWidgetDetails={this._openModal('details')}
                />
              </Switch.Case>
            </Switch>
          </Provider>
        </Modal>
      </div>
    );
  }

  _openModal = (modalName: 'none' | 'details' | 'addLink') => () => this.setState({ openedModal: modalName });

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
