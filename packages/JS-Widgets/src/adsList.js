import { h, Component } from 'preact';

import './adsList.css';

import AdDetails from './adDetails';

export default class AdsList extends Component {

  columns = [
    { name: 'Probability', prop: 'probability' },
    { name: 'Ad content', prop: 'summary' },
    { name: 'Total ETH', prop: 'score' },
    { name: 'Bids', prop: 'bids' },
  ];

  render({ ads }) {
    return (
      <div class="ads-list">
        {this._renderHeader()}
        <div class="content">
          {ads.map(this._renderRow)}
        </div>
      </div>
    );
  }

  _renderHeader = () => {
    return (
      <div class="table-header">
        {this.columns.map(({ name }) => <div class="cell">{name}</div>)}
      </div>
    );
  };

  _renderRow = (ad, index) => {
    const { activeRow } = this.state;
    const result = [];
    result.push((
      <div class="table-row" onClick={this._toggleAdDetails.bind(null, index)}>
        {this.columns.map(({ prop }) => <div class="cell">{ad[prop]}</div>)}
      </div>
    ));

    if (activeRow === index) {
      result.push(<AdDetails ad={ad} ads={this.props.ads} context={this.props.context} />);
    }

    return result;
  };

  _toggleAdDetails = (index) => {
    this.setState(({ activeRow }) => {
      if (activeRow === index) {
        return { activeRow: null };
      }
      return { activeRow: index };
    });
  };
}
