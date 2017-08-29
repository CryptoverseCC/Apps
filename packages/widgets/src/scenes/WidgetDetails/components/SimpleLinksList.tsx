import { h, Component } from 'preact';

import Link from '@userfeeds/apps-components/src/Link';
import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';

import { ILink } from '../../../types';

import * as style from './simpleLinksList.scss';

interface ISimpleLinksListProps {
  links: ILink[];
}

interface ISimpleLinksListState {
  maxRows: number;
}

export default class SimpleLinksList extends Component<ISimpleLinksListProps, ISimpleLinksListState> {

    // ToDo make it better
    columns = [{
      name: 'NO',
      prop: (_, index) => index + 1,
    }, {
      name: 'Probability',
      prop: (link: ILink) => typeof link.probability === 'number' ? `${link.probability}%` : '-',
    }, {
      name: 'Bids',
      prop: (link: ILink) => link.group_count,
    }, {
      name: 'Current Score',
      prop: (link: ILink) => web3.fromWei(link.score, 'ether').substr(0, 5),
    }];

  state = {
    maxRows: 5,
  };

  render({ links }: ISimpleLinksListProps) {
    return (
      <div class={style.self}>
        {links.map(this._renderRow)}
      </div>
    );
  }

  _renderRow = (link: ILink, index: number) => {
    return (
      <div class={style.linkRow}>
        <Link link={link} />
        <div class={style.linkProperties}>
          {this.columns.map(({ name, prop }) => (<TextWithLabel label={name} text={prop(link, index)} />))}
        </div>
        <hr />
      </div>
    );
  }
}
