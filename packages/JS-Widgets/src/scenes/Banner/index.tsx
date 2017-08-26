import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import * as classnames from 'classnames/bind';
import { returntypeof } from 'react-redux-typescript';

import Icon from '@userfeeds/apps-components/src/Icon';
import Link from '@userfeeds/apps-components/src/Link';
import Label from '@userfeeds/apps-components/src/Label';
import Tooltip from '@userfeeds/apps-components/src/Tooltip';

import { ILink } from '../../types';
import { IRootState } from '../../reducers';
import { fetchLinks } from '../../actions/links';
import { observeInjectedWeb3 } from '../../actions/web3';
import { visibleLinks } from '../../selectors/links';

import Switch from '../../components/utils/Switch';
import EthereumLogo from '../../components/EthereumLogo';


import Menu from './containers/Menu';
import RootModal from './containers/RootModal';
import RootToast from './containers/RootToast';

import * as style from './banner.scss';

const cx = classnames.bind(style);

const mapStateToProps = (state: IRootState) => {
  const { links, widget } = state;

  return {
    fetched: links.fetched,
    links: visibleLinks(state),
    size: widget.size,
    timeslot: widget.timeslot,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchLinks(): void {
    dispatch(fetchLinks());
  },
  observeWeb3(): void {
    dispatch(observeInjectedWeb3());
  },
});

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);
type IBannerProps = typeof State2Props & typeof Dispatch2Props;

interface IBannerState {
  currentLink?: ILink;
  optionsOpen: boolean;
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Banner extends Component<IBannerProps, IBannerState> {

  _timeout: number | null = null;
  state: IBannerState = {
    optionsOpen: false,
  };

  constructor(props: IBannerProps) {
    super(props);

    props.observeWeb3();
    props.fetchLinks();
  }

  componentWillReceiveProps(newProps: IBannerProps) {
    if (newProps.links !== this.props.links && newProps.links.length > 0) {
      this.setState({ currentLink: this._getRandomLink(newProps.links) });
      this._setTimeout(newProps.links);
    }
  }

  render({ links, size, fetched }: IBannerProps, { currentLink, optionsOpen }: IBannerState) {
    if (!fetched) {
      return <div />;
    }

    return (
      <div class={cx(['self', size])} onMouseLeave={this._onInfoLeave}>
        <div class={cx('options', { open: optionsOpen })}>
          <div>
            <span class={style.probabilityLabel}>Probability: </span>
            <div class={style.probability}>{currentLink && `${currentLink.probability}%`}</div>
          </div>
          <div class={style.arrows}>
            <div class={cx('arrow', 'left')} onClick={this._onPrevClick}><Icon name="arrow-left" /></div>
            <div class={cx('arrow', 'right')} onClick={this._onNextClick}><Icon name="arrow-right" /></div>
          </div>
          <Menu />
        </div>
        <div class={cx('container', { clickable: !!currentLink })} onClick={this._openTargetUrl}>
          <div
            class={style.info}
            onMouseEnter={this._onInfoEnter}
            onClick={this._onInfoEnter}
          >
            Sponsored with <EthereumLogo class={style.icon} />
          </div>
          <Switch expresion={fetched && !!currentLink}>
            <Switch.Case condition>
              <Link link={currentLink} lines={size === 'rectangle' ? 8 : 2} />
            </Switch.Case>
            <Switch.Case condition={false}>
              <Label>No ads available</Label>
            </Switch.Case>
          </Switch>
        </div>
        <RootModal />
        <RootToast />
      </div>
    );
  }

  _onInfoEnter = () => {
    this.setState({ optionsOpen: true });
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
    const { links } = this.props;
    const { currentLink } = this.state;
    const currentIndex = links.indexOf(currentLink);

    this.setState({
      currentLink: links[currentIndex - 1 < 0 ? links.length - 1 : currentIndex - 1],
    }, () => this._setTimeout(this.props.links));
  }

  _onNextClick = () => {
    const { links } = this.props;
    const { currentLink } = this.state;
    const currentIndex = links.indexOf(currentLink);

    this.setState({
      currentLink: links[currentIndex + 1 >= links.length ? 0 : currentIndex + 1],
    }, () => this._setTimeout(this.props.links));
  }

  _setTimeout(links) {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    this._timeout = setTimeout(() => {
      this.setState({
        currentLink: this._getRandomLink(links),
      }, () => this._setTimeout(this.props.links));
    }, this.props.timeslot * 1000);
  }

  _getRandomLink(links: ILink[]) {
    let randomScore = Math.random() * links.reduce((acc, { score }) => acc + score, 0);

    if (randomScore === 0) {
      return links[Math.round(Math.random() * (links.length - 1))];
    }

    return links.find(({ score }) => {
      randomScore -= score;
      return randomScore < 0;
    });
  }
}
