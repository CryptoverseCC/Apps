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
  recipientAddress: string;
  algorithm: string;
  hasWhitelist: boolean;
  size: TWidgetSize;
  links: ILink[];
  whitelistedLinks: ILink[];
  allLinks: ILink[];
  allLinksCount: number;
  onBoostSuccess?: (transationId: string) => void;
  onBoostError?: (error: any) => void;
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
    const { web3Enabled, recipientAddress, size,
      algorithm, links, hasWhitelist,
      whitelistedLinks, allLinks, allLinksCount,
      onBoostError, onBoostSuccess } = this.props;

    return (
      <div class={style.self} onScroll={this._onScroll}>
        <LinksList
          label="Slots"
          recipientAddress={recipientAddress}
          links={links}
          boostDisabled={!web3Enabled.enabled}
          boostDisabledReason={web3Enabled.reason}
          onBoostSuccess={onBoostSuccess}
          onBoostError={onBoostError}
          ref={this._onRef('Links.Slots')}
        />
        <LinksList
          label="Whitelist"
          showProbability={false}
          recipientAddress={recipientAddress}
          links={whitelistedLinks}
          boostDisabled={!web3Enabled.enabled}
          boostDisabledReason={web3Enabled.reason}
          onBoostSuccess={onBoostSuccess}
          onBoostError={onBoostError}
          ref={this._onRef('Links.Whitelist')}
        />
        { !hasWhitelist && (
          <LinksList
            label="Algorithm"
            showProbability={false}
            recipientAddress={recipientAddress}
            links={allLinks}
            boostDisabled={!web3Enabled.enabled}
            boostDisabledReason={web3Enabled.reason}
            onBoostSuccess={onBoostSuccess}
            onBoostError={onBoostError}
            ref={this._onRef('Links.Algorithm')}
          />
        )}
        <WidgetSpecification
          size={size}
          algorithm={algorithm}
          ref={this._onRef('Specification')}
        />
        <UserfeedAddressInfo
          recipientAddress={recipientAddress}
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
    const viewport = {
      top: e.target.scrollTop,
      bottom: e.target.scrollTop + e.target.offsetHeight,
    };

    const visibleSections = Object.entries(this.refs)
      .filter(([, ref]) => {
        const bounds = {
          top: ref.base.offsetTop,
          bottom: ref.base.offsetTop + ref.base.offsetHeight,
        };

        return ((bounds.top <= viewport.bottom) && (bounds.bottom >= viewport.top));
      })
      .map(([name]) => name);

    const closedView = visibleSections[0];
    this.props.scrolledTo(closedView);
  }, 100, { leading: false });
}
