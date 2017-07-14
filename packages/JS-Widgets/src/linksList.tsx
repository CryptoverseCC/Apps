import { h, Component } from 'preact';

import { ILink } from './types';

import web3 from './utils/web3';
import Link from './components/link';
import BidLink from './components/bidLink';
import Button from './components/button';
import LinkDetails from './linkDetails';

import * as style from './linksList.scss';

interface ILinksListProps {
  links: ILink[];
  context: string;
  showProbability?: boolean;
}

export default class LinksList extends Component<ILinksListProps, {}> {

  constructor(props: ILinksListProps) {
    super(props);
    const { showProbability = true } = props;

    // ToDo make it better
    if (showProbability) {
      this.columns = [
        { name: 'NO', prop: (_, index) => index + 1 },
        { name: 'Probability', prop: 'probability' },
        { name: 'Content', prop: (link) => <Link link={link} showProbability={false} />, style: { flexGrow: 0.7 } },
        { name: 'Current Score [Eth]', prop: (link) => web3.fromWei(link.score, 'ether').substr(0, 5) },
        { name: 'Bids', prop: (link) => (
          <span>
            {link.bids || 0}
            <BidLink context={this.props.context} link={link} links={this.props.links} />
          </span>
        )},
      ];
    } else {
      this.columns = [
        { name: 'NO', prop: (_, index) => index + 1 },
        { name: 'Content', prop: (link) => <Link link={link} showProbability={false} />, style: { flexGrow: 0.7 } },
        { name: 'Current Score [Eth]', prop: (link) => web3.fromWei(link.score, 'ether').substr(0, 5) },
        { name: 'Bids', prop: (link) => (
          <span>
            {link.bids || 0}
            <BidLink context={this.props.context} link={link} links={this.props.links} />
          </span>
        )},
      ];
    }
  }

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
        {this.columns.map(({ name, style: extraStyle }) => <div class={style.cell} style={extraStyle}>{name}</div>)}
      </div>
    );
  }

  _renderRow = (link: ILink, index) => {
    const result: JSX.Element[] = [];
    result.push((
      <div class={style.tableRow}>
        {this.columns.map(({ prop, style: extraStyle }) => {
          if (typeof prop === 'function') {
            return <div class={style.cell} style={extraStyle}>{prop(link, index)}</div>;
          }
          return <div class={style.cell} style={extraStyle}>{link[prop]}</div>;
        })}
      </div>
    ));

    return result;
  }
}
