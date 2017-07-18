import { h, Component } from 'preact';

import { ILink } from '../../../types';

import web3 from '../../../utils/web3';

import Link from '../../../components/Link';
import BidLink from '../../../components/BidLink';
import Button from '../../../components/Button';
import Paper from '../../../components/Paper';

import * as style from './linksList.scss';

interface ILinksListProps {
  links: ILink[];
  context: string;
  showProbability?: boolean;
}

export default class LinksList extends Component<ILinksListProps, {}> {

  // ToDo make it better
  columns = [{
    name: 'NO',
    prop: (_, index) => index + 1,
  }, {
    name: 'Probability',
    prop: (link: ILink) => `${link.probability}%`,
  }, {
    name: 'Content',
    prop: (link: ILink) => <Link link={link} showProbability={false} />,
  }, {
    name: 'Current Score',
    prop: (link: ILink) => web3.fromWei(link.score, 'ether').substr(0, 5),
  }, {
    name: 'Bids',
    prop: (link: ILink) => (
      <span>
        {link.group_count || 0}
        <BidLink context={this.props.context} link={link} links={this.props.links} />
      </span>
    ),
  }];

  constructor(props: ILinksListProps) {
    super(props);
    const { showProbability = true } = props;

    if (!showProbability) {
      this.columns.splice(1, 1);
    }
  }

  render({ links }: ILinksListProps) {
    return (
      <Paper class={style.self}>
        <table class={style.table}>
          {this._renderHeader()}
          <tbody>
            {links.map(this._renderRow)}
          </tbody>
        </table>
      </Paper>
    );
  }

  _renderHeader = () => {
    return (
      <thead class={style.tableHeader}>
        <tr>
          {this.columns.map(({ name }) => <th>{name}</th>)}
        </tr>
      </thead>
    );
  }

  _renderRow = (link: ILink, index) => {
    return (
      <tr>
        {this.columns.map(({ prop }) => <td>{prop(link, index)}</td>)}
      </tr>
    );
  }
}
