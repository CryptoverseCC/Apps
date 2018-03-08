import { observable, computed, action } from 'mobx';
import { fromPromise } from 'mobx-utils';
import Raven from 'raven-js';

import calculateProbabilities from '@linkexchange/utils/links';
import { ILink, IRemoteLink } from '@linkexchange/types/link';
import { throwErrorOnNotOkResponse } from '@linkexchange/utils/fetch';
import { IWidgetSettings } from '@linkexchange/types/widget';
import RankingRequestBuilder, { IRankingRequestBuilderCtor } from '@linkexchange/ranking-request-builder';

export default class LinksStore {
  @observable fetching: boolean = false;
  @observable fetched: boolean = true;

  widgetSettings: IWidgetSettings;

  constructor(
    widgetSettings: IWidgetSettings,
    private RankingRequestBuilderCtor: IRankingRequestBuilderCtor = RankingRequestBuilder,
  ) {
    this.widgetSettings = widgetSettings;
  }

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
    return fromPromise(this.rankingRequestBuilder.allLinksFetch())
  }

  @computed
  get allLinks() {
    return this.allLinksPromise.case({
      pending: () => [],
      fulfilled: (t) => t.items,
      rejected: (t) => [],
    });
  }

  @computed
  get whitelistedLinksPromise() {
    return fromPromise(this.rankingRequestBuilder.whitelistedLinksFetch());
  }

  @computed
  get whitelistedLinks() {
    return this.whitelistedLinksPromise.case({
      pending: () => [],
      fulfilled: (t) => t.items,
      rejected: (t) => [],
    });
  }
}
