import { h, Component } from 'preact';
import classnames from 'classnames/bind';

import style from './banner.scss';

import Switch from './components/utils/switch';
import Label from './components/label';
import Ad from './components/ad';
import Menu from './menu';

const cx = classnames.bind(style);

export default class Banner extends Component {

  static defaultProps = {
    size: 'rectangle', // 'rectangle' | 'leaderboard'
    timeslot: 5,
  };

  constructor(props) {
    super(props);

    this._timeout = null;
    this.state = {
      fetched: false,
      noData: false,
    };
  }

  componentWillMount() {
    this._fetchAds()
      .then(({ sum, ads }) => {
        this.setState({
          sum,
          ads,
          fetched: true,
          currentAd: this._getRandomAd(sum, ads),
        }, () => this._setTimeout());
      })
      .catch((_error) => {
        this.setState({ fetched: true, noData: true, ads: [], sum: 0 });
      });
  }

  render({ context, algorithm, size }, { fetched, noData, currentAd, ads }) {
    if (!fetched) {
      return null;
    }

    return (
      <div class={cx(['this', size])}>
        <Switch expresion={noData}>
          <Switch.Case condition={true}>
            <Label>No ads available</Label>
          </Switch.Case>
          <Switch.Case condition={false}>
            <Ad ad={currentAd} />
          </Switch.Case>
        </Switch>
        <div class={style.options}>
          <Menu context={context} algorithm={algorithm} ads={ads} />
          <div class={style.arrows}>
            <div onClick={this._onPrevClick}>❮</div>
            <div onClick={this._onNextClick}>❯</div>
          </div>
        </div>
      </div>
    );
  }

  _onPrevClick = () => {
    const { ads, currentAd } = this.state;
    const currentIndex = ads.indexOf(currentAd);
    this.setState({
      currentAd: ads[currentIndex - 1 < 0 ? ads.length - 1 : currentIndex - 1],
    }, () => this._setTimeout());
  };

  _onNextClick = () => {
    const { ads, currentAd } = this.state;
    const currentIndex = ads.indexOf(currentAd);
    this.setState({
      currentAd: ads[currentIndex + 1 >= ads.length ? 0 : currentIndex + 1],
    }, () => this._setTimeout());
  };

  _fetchAds() {
    return fetch(`https://api.userfeeds.io/ranking/${this.props.context}/${this.props.algorithm}/`)
      .then((res) => res.json())
      .then(({ items: ads }) => {
        if (ads.length === 0) {
          throw new Error('No Data');
        }

        const scoreSum = ads.reduce((acc, { score }) => acc + score, 0);
        const probabilities = ads.map(({ score }) => score / scoreSum * 100);
        const roundedDownProbabilities = probabilities.map((probability) => Math.floor(probability));
        const roundedDownProbabilitiesSum = roundedDownProbabilities.reduce((acc, probability) => acc + probability, 0);

        let roundedProbabilities;
        if (roundedDownProbabilitiesSum === 100) {
          roundedProbabilities = roundedDownProbabilities;
        } else {
          const toDistribute = 100 - roundedDownProbabilitiesSum;
          const toRoundUp = roundedDownProbabilities
            .map((p, i) => ([probabilities[i] - p, i]))
            .sort(([p1], [p2]) => p2 - p1)
            .slice(0, toDistribute)
            .reduce((acc, [_, i]) => {
              acc[i] = true;
              return acc;
            }, []);

          roundedProbabilities = roundedDownProbabilities
            .map((probability, index) => toRoundUp[index] ? probability + 1 : probability);
        }

        return {
          sum: scoreSum,
          ads: ads.map((ad, i) => Object.assign({ probability: roundedProbabilities[i] }, ad)),
        };
      });
  }

  _setTimeout() {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    this._timeout = setTimeout(() => {
      this.setState({
        currentAd: this._getRandomAd(this.state.sum, this.state.ads),
      }, () => this._setTimeout());
    }, this.props.timeslot * 1000);
  }

  _getRandomAd(sum, ads) {
    let randomScore = Math.random() * sum;

    return ads.find(({ score }) => {
      randomScore -= score;
      return randomScore < 0;
    });
  }
}
