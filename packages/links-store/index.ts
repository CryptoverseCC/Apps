import { observable, computed, action, autorun } from 'mobx';
import { fromPromise } from 'mobx-utils';

import calculateProbabilities from '@linkexchange/utils/links';
import { IRemoteLink } from '@linkexchange/types/link';
import { IWidgetSettings } from '@linkexchange/types/widget';
import RankingRequestBuilder, { IRankingRequestBuilderCtor } from '@linkexchange/ranking-request-builder';

export default class LinksStore {
  @observable fetching: boolean = false;
  @observable fetched: boolean = true;
  @observable nonce = 0;
  @observable lastAllLinks: IRemoteLink[] = [];
  @observable lastWhitelistedLinks: IRemoteLink[] = [];

  constructor(
    private widgetSettings: IWidgetSettings,
    private RankingRequestBuilderCtor: IRankingRequestBuilderCtor = RankingRequestBuilder,
  ) {}

  @computed
  get rankingRequestBuilder() {
    return new this.RankingRequestBuilderCtor(this.widgetSettings);
  }

  @computed
  get visibleLinks() {
    const { slots } = this.widgetSettings;
    const linksInSlots = (this.widgetSettings.whitelist !== '' ? this.whitelistedLinks : this.allLinks).slice(0, slots);
    const linksTotalScore = linksInSlots.reduce((acc, { score }) => acc + score, 0);

    if (linksTotalScore === 0) {
      return calculateProbabilities(linksInSlots);
    }

    return calculateProbabilities(linksInSlots.filter(({ score }) => score > 0));
  }

  @computed
  get allLinksPromise() {
    return fromPromise(this.rankingRequestBuilder.allLinksFetch(this.nonce));
  }

  @computed
  get allLinks(): IRemoteLink[] {
    return this.allLinksPromise.case({
      pending: () => this.lastAllLinks,
      fulfilled: (t) => {
        autorun(() => (this.lastAllLinks = t.items));
        return t.items;
      },
      rejected: (t) => [],
    });
  }

  @action.bound
  refetch() {
    this.nonce += 1;
  }

  @computed
  get whitelistedLinksPromise() {
    return fromPromise(this.rankingRequestBuilder.whitelistedLinksFetch(this.nonce));
  }

  @computed
  get whitelistedLinks() {
    return this.whitelistedLinksPromise.case({
      pending: () => this.lastWhitelistedLinks,
      fulfilled: (t) => {
        autorun(() => (this.lastWhitelistedLinks = t.items));
        return t.items;
      },
      rejected: (t) => [],
    });
  }
}
