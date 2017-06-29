import React, { Component } from 'react';

import LinkDetails from '../components/LinkDetails';

import style from './LinksList.scss';

const columns = [
  { name: 'Probability', prop: 'probability' },
  { name: 'Ad content', prop: 'summary' },
  { name: 'Total ETH', prop: (ad) => web3.fromWei(ad.score, 'ether') },
  { name: 'Bids', prop: (ad) => ad.bids || 0 },
];

export default class LinksList extends Component {

  state = {
    activeRow: null,
  };

  render() {
    const { links } = this.props;
    return (
      <div className={style.this}>
        {this._renderHeader()}
        <div className={style.content}>
          { links.map(this._renderRow)}
        </div>
      </div>
    );
  }

  _renderHeader = () => (
    <div className={style.tableHeader}>
      {columns.map(({ name }) => <div key={name} className={style.cell}>{name}</div>)}
    </div>
  );

  _renderRow = (link, position) => {
    const result = [(
      <div
        key={position + link.target}
        className={style.tableRow}
        onClick={() => this._onRowClick(position)}
      >
        { columns.map(({ prop }) => {
          if (typeof prop === 'function') {
            return <div key={prop} className={style.cell}>{prop(link)}</div>;
          }
          return <div key={prop} className={style.cell}>{link[prop]}</div>;
        })}
      </div>
    )];

    if (position === this.state.activeRow) {
      result.push((
        <LinkDetails
          context={this.props.context}
          link={link}
          links={this.props.links}
          position={position}
        />
      ));
    }

    return result;
  };

  _onRowClick = (index) => this.setState(({ activeRow }) => {
    if (index === activeRow) {
      return { activeRow: null };
    }
    return { activeRow: index };
  });
}
