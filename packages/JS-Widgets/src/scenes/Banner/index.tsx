import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import * as classnames from 'classnames/bind';
import { returntypeof } from 'react-redux-typescript';

import { ILink } from '../../types';
import { IRootState } from '../../reducers';
import { fetchLinks } from '../../actions/links';
import { visibleLinks } from '../../selectors/links';

import Switch from '../../components/utils/Switch';
import Label from '../../components/Label';
import Link from '../../components/Link';

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
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Banner extends Component<IBannerProps, IBannerState> {

  _timeout: number | null = null;
  state: IBannerState = {};

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

  render({ links, size, fetched }: IBannerProps, { currentLink }: IBannerState) {
    if (!fetched) {
      return <div />;
    }

    return (
      <div class={cx(['self', size])}>
        <Switch expresion={fetched && !!currentLink}>
          <Switch.Case condition>
            <Link link={currentLink} />
          </Switch.Case>
          <Switch.Case condition={false}>
            <Label>No ads available</Label>
          </Switch.Case>
        </Switch>
        <div class={style.options}>
          <div class={style.arrows}>
            <div onClick={this._onPrevClick}>❮</div>
            <div onClick={this._onNextClick}>❯</div>
          </div>
          <Menu />
        </div>
        <RootModal />
      </div>
    );
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

    return links.find(({ score }) => {
      randomScore -= score;
      return randomScore < 0;
    });
  }
}
