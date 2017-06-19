import { h, Component } from 'preact';

import './banner.css';

import Ad from './components/ad';
import Menu from './menu';

export default class Banner extends Component {

  static defaultProps = {
    timeslot: 5,
  };

  constructor() {
    super();

    this._timeout = null;
    this.state = {
      fetched: false,
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
      });
  }

  render({ context, algorithm }, { fetched, currentAd, ads }) {
    if (!fetched) {
      return null;
    }
    return (
      <div class="container">
        <Ad ad={currentAd} />
        <div class="options">
          <Menu context={context} algorithm={algorithm} ads={ads} />
          <div class="arrows">
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
    return fetch(
      `https://api.userfeeds.io/beta/api/ranking/${this.props.context}/${this.props.algorithm}/`,
      { headers: { Authorization: this.props.apiKey } })
      .then((res) => res.json())
      .then(({ items: ads }) => {
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
            .sort(([p1], [p2]) => p1 - p2)
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
