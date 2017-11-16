import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import { returntypeof } from 'react-redux-typescript';

import { ILink } from '@userfeeds/types/link';
import Icon from '@linkexchange/components/src/Icon';
import Link from '@linkexchange/components/src/Link';
import Label from '@linkexchange/components/src/Label';
import Tooltip from '@linkexchange/components/src/Tooltip';
import Switch from '@linkexchange/components/src/utils/Switch';
import TokenLogo from '@linkexchange/components/src/TokenLogo';

import { IRootState } from '../../ducks';
import { fetchLinks } from '../../ducks/links';
import { visibleLinks } from '../../selectors/links';

import Menu from './containers/Menu';
import RootModal from './containers/RootModal';
import RootToast from './containers/RootToast';
import RandomLinkProvider from './containers/RandomLinkProvider';

import * as style from './banner.scss';

const cx = classnames.bind(style);

const mapStateToProps = (state: IRootState) => {
  const { links, widget } = state;

  return {
    fetched: links.fetched,
    links: visibleLinks(state),
    size: widget.size,
    timeslot: widget.timeslot,
    asset: widget.asset,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchLinks(): void {
    dispatch(fetchLinks());
  },
});

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);
type IBannerProps = typeof State2Props & typeof Dispatch2Props;

interface IBannerState {
  currentLink?: ILink;
  optionsOpen: boolean;
}

class Banner extends Component<IBannerProps, IBannerState> {
  linkProvider: RandomLinkProvider;
  state: IBannerState = {
    optionsOpen: false,
  };

  constructor(props: IBannerProps) {
    super(props);

    props.fetchLinks();
  }

  render() {
    const { links, size, fetched, timeslot, asset } = this.props;
    const { currentLink, optionsOpen } = this.state;
    if (!fetched) {
      return <div />;
    }

    return (
      <div className={cx(['self', size])} onMouseLeave={this._onInfoLeave}>
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
          <Menu />
        </div>
        <div className={cx('container', { clickable: !!currentLink })} onClick={this._openTargetUrl}>
          <div className={style.info} onMouseEnter={this._onInfoEnter} onClick={this._onInfoEnter}>
            Sponsored with <TokenLogo className={style.icon} asset={asset} />
          </div>
          <Switch expresion={fetched && !!currentLink}>
            <Switch.Case condition>
              {currentLink && <Link link={currentLink} lines={size === 'rectangle' ? 8 : 2} />}
            </Switch.Case>
            <Switch.Case condition={false}>
              <Label>No ads available</Label>
            </Switch.Case>
          </Switch>
        </div>
        <RandomLinkProvider
          ref={(ref: RandomLinkProvider) => (this.linkProvider = ref)}
          links={links}
          timeslot={timeslot}
          onLink={this._onLink}
        />
        <RootModal />
        <RootToast />
      </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
