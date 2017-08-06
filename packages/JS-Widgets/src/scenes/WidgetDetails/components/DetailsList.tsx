import { h, Component } from 'preact';
import * as throttle from 'lodash/throttle';

import { ILink, TWidgetSize } from '../../../types';

import { TViewType } from '../';

import LinksList from './LinksList';
import WidgetSpecification from './WidgetSpecification';
import UserfeedAddressInfo from './UserfeedsAddressInfo';

import * as style from './detailsList.scss';

interface IAllLinkProps {
  web3Enabled: {
    enabled: boolean;
    reason?: string;
  };
  initialView: TViewType;
  context: string;
  size: TWidgetSize;
  links: ILink[];
  whitelistedLinks: ILink[];
  allLinks: ILink[];
  allLinksCount: number;
  scrolledTo(to: TViewType): void;
}

export default class AllLinks extends Component<IAllLinkProps, {}> {

  refs: { [key: string]: any; } = {};

  scrollTo(to: TViewType) {
    this.refs[to].base.scrollIntoView(true);
  }

  componentDidMount() {
    if (this.props.initialView) {
      this.scrollTo(this.props.initialView);
    }
  }

  render() {
    const { web3Enabled, context, size, links, whitelistedLinks, allLinks, allLinksCount } = this.props;

    return (
      <div class={style.self} onScroll={this._onScroll}>
        <LinksList
          label="Slots"
          context={context}
          links={links}
          boostDisabled={!web3Enabled.enabled}
          ref={this._onRef('Links.Slots')}
        />
        <LinksList
          label="Whitelist"
          showProbability={false}
          context={context}
          links={whitelistedLinks}
          boostDisabled={!web3Enabled.enabled}
          ref={this._onRef('Links.Whitelist')}
        />
        <LinksList
          label="Algorithm"
          showProbability={false}
          context={context}
          links={allLinks}
          boostDisabled={!web3Enabled.enabled}
          ref={this._onRef('Links.Algorithm')}
        />
        <WidgetSpecification
          size={size}
          ref={this._onRef('Specification')}
        />
        <UserfeedAddressInfo
          context={context}
          linksNumber={allLinksCount}
          ref={this._onRef('Userfeed')}
        />
      </div>
    );
  }

  _onRef = (name: string) => (ref) => {
    this.refs[name] = ref;
  }

  _onScroll = throttle((e) => {
    const scrollTop = e.target.scrollTop;
    const [closedView] = Object.entries(this.refs)
      .map(([key, ref]) => ([key, scrollTop - ref.base.offsetTop]))
      .reduce((acc, item) => {
        if (Math.abs(item[1]) < acc[1]) {
          return item;
        }
        return acc;
      }, [null, Number.MAX_SAFE_INTEGER]);
    this.props.scrolledTo(closedView);
  }, 100);
}
