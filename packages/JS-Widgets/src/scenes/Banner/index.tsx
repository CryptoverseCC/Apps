import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import * as classnames from 'classnames/bind';
import { returntypeof } from 'react-redux-typescript';

import { ILink } from '../../types';
import { IRootState } from '../../reducers';
import { fetchLinks } from '../../actions/links';
import { visibleLinks } from '../../selectors/links';

import Switch from '../../components/utils/Switch';
import EthereumLogo from '../../components/EthereumLogo';
import Tooltip from '../../components/Tooltip';
import Label from '../../components/Label';
import Link from '../../components/Link';
import Icon from '../../components/Icon';

import Menu from './containers/Menu';
import RootModal from './containers/RootModal';

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
        <div
          class={style.info}
          onMouseEnter={this._onInfoEnter}
          onClick={this._onInfoEnter}
        >
          <EthereumLogo class={style.icon} />
        </div>
        <div class={cx('options', { open: optionsOpen })}>
          <div class={style.arrows}>
            <div class={cx('arrow', 'left')} onClick={this._onPrevClick}><Icon name="chevron-left" /></div>
            <Tooltip class={style.probability} text="Link probability">{currentLink && `${currentLink.probability}%`}</Tooltip>
            <div class={cx('arrow', 'right')} onClick={this._onNextClick}><Icon name="chevron-right" /></div>
          </div>
          <Menu />
          <div />
        </div>
        <div class={style.container}>
          <Switch expresion={fetched && !!currentLink}>
            <Switch.Case condition>
              <Link clickable link={currentLink} lines={size === 'rectangle' ? 8 : 2} />
            </Switch.Case>
            <Switch.Case condition={false}>
              <Label>No ads available</Label>
            </Switch.Case>
          </Switch>
        </div>
        <RootModal />
      </div>
    );
  }

  _onInfoEnter = () => {
    this.setState({ optionsOpen: true });
  }

  _onInfoLeave = () => {
    setTimeout(() => this.setState({ optionsOpen: false }), 200);
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
