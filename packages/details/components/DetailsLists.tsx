import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import * as throttle from 'lodash/throttle';

import { ILink, IRemoteLink } from '@linkexchange/types/link';

import { EWidgetSize } from '@linkexchange/types/widget';
import { TViewType } from '../';

import LinksList from './LinksList';
import WidgetSpecification from './WidgetSpecification';
import UserfeedAddressInfo from './UserfeedsAddressInfo';

import * as style from './detailsLists.scss';

interface IDetailsListsinkProps {
  initialView: TViewType;
  asset: string;
  recipientAddress: string;
  algorithm: string;
  hasWhitelist: boolean;
  size: EWidgetSize;
  links: ILink[];
  whitelistedLinks: IRemoteLink[];
  allLinks: IRemoteLink[];
  allLinksCount: number;
  onBoostSuccess?: (transationId: string) => void;
  onBoostError?: (error: any) => void;
  scrolledTo(to: TViewType): void;
}

export default class DetailsLists extends Component<IDetailsListsinkProps, {}> {
  componentsRefs: { [key: string]: any } = {};

  scrollTo(to: TViewType) {
    findDOMNode(this.componentsRefs[to]).scrollIntoView(true);
  }

  componentDidMount() {
    if (this.props.initialView) {
      this.scrollTo(this.props.initialView);
    }
  }

  render() {
    const {
      asset,
      recipientAddress,
      size,
      algorithm,
      links,
      hasWhitelist,
      whitelistedLinks,
      allLinks,
      allLinksCount,
      onBoostError,
      onBoostSuccess,
    } = this.props;

    return (
      <div className={style.self} onScroll={this._onScroll}>
        <LinksList
          label="Slots"
          asset={asset}
          recipientAddress={recipientAddress}
          links={links}
          onBoostSuccess={onBoostSuccess}
          onBoostError={onBoostError}
          ref={this._onRef('Links.Slots')}
        />

        {hasWhitelist ? (
          <LinksList
            label="Whitelist"
            showProbability={false}
            asset={asset}
            recipientAddress={recipientAddress}
            links={whitelistedLinks}
            onBoostSuccess={onBoostSuccess}
            onBoostError={onBoostError}
            ref={this._onRef('Links.Whitelist')}
          />
        ) : (
          <LinksList
            label="Algorithm"
            showProbability={false}
            asset={asset}
            recipientAddress={recipientAddress}
            links={allLinks}
            onBoostSuccess={onBoostSuccess}
            onBoostError={onBoostError}
            ref={this._onRef('Links.Algorithm')}
          />
        )}
        <WidgetSpecification size={size} algorithm={algorithm} asset={asset} ref={this._onRef('Specification')} />
        <UserfeedAddressInfo
          recipientAddress={recipientAddress}
          linksNumber={allLinksCount}
          ref={this._onRef('Userfeed')}
        />
      </div>
    );
  }

  _onRef = (name: string) => (ref) => {
    this.componentsRefs[name] = ref;
  }

  // ToDo rewrite!!
  _onScroll = (event) => {
    event.persist();
    this._onScrollThrottled(event.currentTarget);
  }

  _onScrollThrottled = throttle(
    (element) => {
      const viewport = {
        top: element.scrollTop,
        bottom: element.scrollTop + element.offsetHeight,
      };

      const visibleSections = Object.entries(this.componentsRefs)
        .filter(([, ref]) => {
          const node = findDOMNode(ref) as HTMLElement;
          const bounds = {
            top: node.offsetTop,
            bottom: node.offsetTop + node.offsetHeight,
          };

          return bounds.top <= viewport.bottom && bounds.bottom >= viewport.top;
        })
        .map(([name]) => name);

      const closedView = visibleSections[0] as TViewType;
      this.props.scrolledTo(closedView);
    },
    100,
    { leading: false },
  );
}
