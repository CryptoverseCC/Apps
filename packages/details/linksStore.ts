import { observable, computed, action } from 'mobx';
import Raven from 'raven-js';

import calculateProbabilities from '@linkexchange/utils/links';
import { ILink, IRemoteLink } from '@linkexchange/types/link';
import { WidgetSettings } from '@linkexchange/widget-settings';

import { throwErrorOnNotOkResponse } from '@linkexchange/utils/fetch';

export default class LinksStore {
  @observable fetching: boolean = false;
  @observable fetched: boolean = false;
  @observable whitelistedLinks: IRemoteLink[] = [];
  @observable allLinks: IRemoteLink[] = [];

  widgetSettings: WidgetSettings;

  constructor(widgetSettings: WidgetSettings) {
    this.widgetSettings = widgetSettings;
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

  @action
  async fetchLinks() {
    const { apiUrl = 'https://api.userfeeds.io', recipientAddress, asset, algorithm, whitelist } = this.widgetSettings;

    this.fetched = false;
    this.fetching = true;

    // tslint:disable-next-line max-line-length
    const rankingApiUrl = `${apiUrl}/ranking/${algorithm};asset=${asset.toLowerCase()};context=${recipientAddress.toLowerCase()}/`;
    const timedecayFilterAlgorithm = algorithm === 'links' ? 'filter_timedecay/' : '';
    const whitelistFilterAlgorithm = whitelist ? `filter_whitelist;whitelist=${whitelist.toLowerCase()}/` : '';
    const groupFilterAlgorithm = 'filter_group;sum_keys=score;sum_keys=total/';
    try {
      const [{ items: whitelistedLinks = [] }, { items: allLinks = [] }] = await Promise.all([
        fetch(`${rankingApiUrl}${timedecayFilterAlgorithm}${whitelistFilterAlgorithm}${groupFilterAlgorithm}`)
          .then(throwErrorOnNotOkResponse)
          .then<{ items: IRemoteLink[] }>((res) => res.json()),
        fetch(`${rankingApiUrl}${timedecayFilterAlgorithm}${groupFilterAlgorithm}`)
          .then(throwErrorOnNotOkResponse)
          .then<{ items: IRemoteLink[] }>((res) => res.json()),
      ]);

      this.allLinks = allLinks;
      this.whitelistedLinks = whitelistedLinks;
      this.fetched = true;
      this.fetching = false;
    } catch (e) {
      Raven.captureException(e);
    }
  }
}
