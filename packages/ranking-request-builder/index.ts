import { IRemoteLink } from '@linkexchange/types/link';
import { throwErrorOnNotOkResponse } from '@linkexchange/utils/fetch';
import { IWidgetSettings } from '@linkexchange/types/widget';

export interface IRankingRequestBuilderCtor {
  new (widgetSettings: IWidgetSettings): IRankingRequestBuilder;
}

export interface IRankingRequestBuilder {
  allLinksFetch(nonce?: any): Promise<{ items: IRemoteLink[] }>;
  whitelistedLinksFetch(nonce?: any): Promise<{ items: IRemoteLink[] }>;
}

export default class RankingRequestBuilder implements IRankingRequestBuilder {
  rankingApiUrl: string;

  constructor(private widgetSettings: IWidgetSettings) {
    this.rankingApiUrl = `${widgetSettings.apiUrl || 'https://api.userfeeds.io'}/ranking`;
  }

  private linksAlgorithm() {
    const { algorithm, recipientAddress, asset } = this.widgetSettings;
    const [algorithmName, ...restParams] = algorithm.split(';');
    const params = restParams.reduce(
      (acc, restParam) => {
        const [key, value] = restParam.split('=');
        return { ...acc, [key]: value };
      },
      {
        asset,
        context: recipientAddress.toLowerCase(),
      },
    );
    return {
      algorithm: algorithmName,
      params,
    };
  }

  private filterGroup() {
    return {
      algorithm: 'filter_group',
      params: {
        // This is a temporary solution for string handling
        sum_keys: 'score;sum_keys=total',
      },
    };
  }

  private filterWhitelistFlow() {
    return this.widgetSettings.whitelist
      ? [
          {
            algorithm: 'filter_whitelist',
            params: {
              whitelist: this.widgetSettings.whitelist.toLowerCase(),
            },
          },
        ]
      : [];
  }

  private filterTimedecayFlow() {
    return this.widgetSettings.algorithm === 'links'
      ? [
          {
            algorithm: 'filter_timedecay',
            params: {
              period: 7,
            },
          },
        ]
      : [];
  }

  allLinksFlow = () => {
    return [this.linksAlgorithm(), ...this.filterTimedecayFlow(), this.filterGroup()];
  };

  whitelistedLinksFlow = () => {
    return [this.linksAlgorithm(), ...this.filterWhitelistFlow(), ...this.filterTimedecayFlow(), this.filterGroup()];
  };

  rankingRequestBody(flow) {
    return JSON.stringify({ flow });
  }

  private flowToString(flow) {
    return flow
      .map((algorithm) => {
        return (
          algorithm.algorithm +
          ';' +
          Object.entries(algorithm.params)
            .map(([key, value]) => `${key}=${value}`)
            .join(';')
        );
      })
      .join('/');
  }

  allLinksFetch = (nonce) => {
    const { allLinksFlow, rankingApiUrl, flowToString, widgetSettings } = this;
    if (!widgetSettings.recipientAddress) {
      return Promise.resolve({ items: [] });
    }

    const allLinksFetch = flowToString(allLinksFlow());
    return fetch(`${rankingApiUrl}/${allLinksFetch}`)
      .then(throwErrorOnNotOkResponse)
      .then<{ items: IRemoteLink[] }>((res) => res.json());
  };

  whitelistedLinksFetch = (nonce) => {
    const { whitelistedLinksFlow, rankingApiUrl, flowToString, widgetSettings } = this;
    if (!widgetSettings.recipientAddress) {
      return Promise.resolve({ items: [] });
    }

    const whitelistedLinksFetch = flowToString(whitelistedLinksFlow());
    return fetch(`${rankingApiUrl}/${whitelistedLinksFetch}`)
      .then(throwErrorOnNotOkResponse)
      .then<{ items: IRemoteLink[] }>((res) => res.json());
  };

  // TODO: UNCOMMENT WHEN JAZZ IS ON PRODUCTION
  // allLinksFetch = () => {
  //   const { rankingRequestBody, allLinksFlow, rankingApiUrl } = this;
  //   return fetch(rankingApiUrl, {
  //     method: 'POST',
  //     body: rankingRequestBody(allLinksFlow()),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then(throwErrorOnNotOkResponse)
  //     .then<{ items: IRemoteLink[] }>((res) => res.json());
  // };

  // whitelistedLinksFetch = () => {
  //   const { rankingRequestBody, whitelistedLinksFlow, rankingApiUrl } = this;
  //   return fetch(rankingApiUrl, {
  //     method: 'POST',
  //     body: rankingRequestBody(whitelistedLinksFlow()),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then(throwErrorOnNotOkResponse)
  //     .then<{ items: IRemoteLink[] }>((res) => res.json());
  // };
}
