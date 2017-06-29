import { h, Component } from 'preact';

import style from './adsList.scss';

import web3 from './utils/web3';
import AdDetails from './adDetails';

export default class AdsList extends Component {

  columns = [
    { name: 'Probability', prop: 'probability' },
    { name: 'Ad content', prop: 'summary' },
    { name: 'Total ETH', prop: (ad) => web3.fromWei(ad.score, 'ether') },
    { name: 'Bids', prop: (ad) => ad.bids || 0 },
  ];

  render({ ads }) {
    return (
      <div class={style.this}>
        {this._renderHeader()}
        <div class={style.content}>
          {ads.map(this._renderRow)}
        </div>
      </div>
    );
  }

  _renderHeader = () => {
    return (
      <div class={style.tableHeader}>
        {this.columns.map(({ name }) => <div class={style.cell}>{name}</div>)}
      </div>
    );
  };

  _renderRow = (ad, index) => {
    const { activeRow } = this.state;
    const result = [];
    result.push((
      <div class={style.tableRow} onClick={this._toggleAdDetails.bind(null, index)}>
        {this.columns.map(({ prop }) => {
          if (typeof prop === 'function') {
            return <div class={style.cell}>{prop(ad)}</div>;
          }
          return <div class={style.cell}>{ad[prop]}</div>;
        })}
      </div>
    ));

    if (activeRow === index) {
      result.push(<AdDetails ad={ad} ads={this.props.ads} context={this.props.context} onShowThankYouRequest={this.props.onShowThankYouRequest} />);
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
