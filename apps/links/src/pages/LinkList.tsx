import { h, Component } from 'preact';
import debounce from 'lodash.debounce';

import Input from '@userfeeds/apps-components/src/Input';
import Paper from '@userfeeds/apps-components/src/Paper';
import LinkListComponent from '@userfeeds/apps-components/src/LinkList';

import * as style from './Whitelist.scss';

interface ILinkListProps {
  location: any;
}

interface ILinkListState {
  links: any[];
  fetching: boolean;
  context: string;
  contextFromParams: boolean;
  algorithm: string;
}

export default class LinkList extends Component<ILinkListProps, ILinkListState> {

  constructor(props) {
    super(props);

    const params = new URLSearchParams(props.location.search);

    this.state = {
      links: [],
      fetching: false,
      context: params.get('context') || '',
      algorithm: params.get('algorithm') || 'links',
      contextFromParams: params.has('context'),
    };
  }

  componentWillMount() {
    if (this.state.contextFromParams) {
      this._fetchLinks();
    }
  }

  render() {
    return (
      <div class={style.self}>
        <Paper class={style.paper}>
          <Input
            placeholder="Advertiser ID"
            value={this.state.context}
            onInput={this._onContextChange}
            disabled={this.state.contextFromParams}
          />
          <LinkListComponent links={this.state.links} />
        </Paper>
      </div>
    );
  }

  _onContextChange = (e) => {
    this.setState({ context: e.target.value });
    this._fetchLinks();
  }

  _fetchLinks = debounce(async () => {
    const { context } = this.state;

    this.setState({ fetching: true });
    const fetchUrl = 'https://api.userfeeds.io/ranking';

    try {
      const allLinksRequest = fetch(`${fetchUrl}/${context}/authored/?type=link`)
        .then((res) => res.json());

      const [allLinks] = await Promise.all([allLinksRequest]);

      this.setState({ links: allLinks.items, fetching: false });

      return allLinks;
    } catch (_) {
      this.setState({ fetching: false });
      return null;
    }
  }, 500);
}
