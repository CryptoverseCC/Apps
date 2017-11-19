import React, { Component } from 'react';
// import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import Loadable from 'react-loadable';

// import { returntypeof } from 'react-redux-typescript';

import { ILink } from '@userfeeds/types/link';
import Icon from '@linkexchange/components/src/Icon';
import Link from '@linkexchange/components/src/Link';
import Label from '@linkexchange/components/src/Label';
import { fetchLinks } from '@linkexchange/details/duck';
import Tooltip from '@linkexchange/components/src/Tooltip';
import Switch from '@linkexchange/components/src/utils/Switch';
import Modal from '@linkexchange/components/src/Modal';
import TokenLogo from '@linkexchange/components/src/TokenLogo';
import { IWidgetState } from '@linkexchange/ducks/widget';

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

// const LazyAddLink = Loadable({
//   loader: () => import('../AddLink'),
//   loading: Loading,
// });

// const RootModal = getRootModal({
//   addLink: LazyAddLink,
//   widgetDetails: LazyWidgetDatails,
// });

// const mapStateToProps = (state: IRootState) => {
//   const { links, widget } = state;

//   return {
//     fetched: links.fetched,
//     links: visibleLinks(state),
//     size: widget.size,
//     timeslot: widget.timeslot,
//     asset: widget.asset,
//   };
// };

// const mapDispatchToProps = (dispatch) => ({
//   fetchLinks(): void {
//     dispatch(fetchLinks());
//   },
// });

// const State2Props = returntypeof(mapStateToProps);
// const Dispatch2Props = returntypeof(mapDispatchToProps);
// type IBannerProps = typeof State2Props & typeof Dispatch2Props;

interface IBannerProps {
  widgetSettings: IWidgetState;
}

interface IBannerState {
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
    const { currentLink, optionsOpen, isModalOpen } = this.state;
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
        <Modal isOpen={isModalOpen}>
          <LazyWidgetDatails widgetSettings={widgetSettings} />
        </Modal>
        {/* <RootModal /> */}
        {/* <RootToast /> */}
      </div>
    );
  }

  _openWidgetDetails = () => {
    this.setState({ isModalOpen: true });
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

// export default connect(mapStateToProps, mapDispatchToProps)(Banner);
