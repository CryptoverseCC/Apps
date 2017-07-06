import { h, Component } from 'preact';

import { ILink } from './types';

import web3 from './utils/web3';
import LinkDetails from './linkDetails';

import * as style from  './linksList.scss';

interface ILinksListProps {
  links: ILink[];
  context: string;
  onShowThankYouRequest?(linkId: string): void;
}

interface ILinksListState {
  activeRow: number;
}

export default class LinksList extends Component<ILinksListProps, ILinksListState> {

  columns = [
    { name: 'Probability', prop: 'probability' },
    { name: 'Title', prop: 'title' },
    { name: 'Link content', prop: 'summary' },
    { name: 'Total ETH', prop: (link) => web3.fromWei(link.score, 'ether') },
    { name: 'Bids', prop: (link) => link.bids || 0 },
  ];

  render({ links }: ILinksListProps) {
    return (
      <div class={style.self}>
        {this._renderHeader()}
        <div class={style.content}>
          {links.map(this._renderRow)}
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

  _renderRow = (link: ILink, index) => {
    const { activeRow } = this.state;
    const result: JSX.Element[] = [];
    result.push((
      <div class={style.tableRow} onClick={this._toggleLinkDetails.bind(null, index)}>
        {this.columns.map(({ prop }) => {
          if (typeof prop === 'function') {
            return <div class={style.cell}>{prop(link)}</div>;
          }
          return <div class={style.cell}>{link[prop]}</div>;
        })}
      </div>
    ));

    if (activeRow === index) {
      result.push(<LinkDetails link={link} links={this.props.links} context={this.props.context} onShowThankYouRequest={this.props.onShowThankYouRequest} />);
    }

    return result;
  };

  _toggleLinkDetails = (index) => {
    // ToDo TS should throws error
    this.setState(({ activeRow }) => {
      if (activeRow === index) {
        return { activeRow: null };
      }
      return { activeRow: index };
    });
  };
}
