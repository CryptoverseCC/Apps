import RankingRequestBuilder from './';
import { EWidgetSize } from '@linkexchange/types/widget';

describe('LinksStore', () => {
  test('allLinksFlow is correctly computed for links algorithm', () => {
    const linksStore = new RankingRequestBuilder({
      apiUrl: 'http://abc.io',
      recipientAddress: '0x0A',
      asset: 'ethereum',
      algorithm: 'links',
      size: EWidgetSize.leaderboard,
      slots: 5,
      timeslot: 1,
    });

    expect(linksStore.allLinksFlow()).toEqual([
      {
        algorithm: 'links',
        params: {
          context: '0x0a',
          asset: 'ethereum',
        },
      },
      {
        algorithm: 'filter_timedecay',
        params: {
          period: 7,
        },
      },
      {
        algorithm: 'filter_group',
        params: {
          sum_keys: 'score;sum_keys=total',
        },
      },
    ]);
  });

  test('whitelistedLinksFlow is correctly computed for links algorithm', () => {
    const linksStore = new RankingRequestBuilder({
      apiUrl: 'http://abc.io',
      recipientAddress: '0x0A',
      asset: 'ethereum',
      algorithm: 'links',
      size: EWidgetSize.leaderboard,
      slots: 5,
      timeslot: 1,
      whitelist: '0x0A',
    });

    expect(linksStore.whitelistedLinksFlow()).toEqual([
      {
        algorithm: 'links',
        params: {
          context: '0x0a',
          asset: 'ethereum',
        },
      },
      {
        algorithm: 'filter_whitelist',
        params: {
          whitelist: '0x0a',
        },
      },
      {
        algorithm: 'filter_timedecay',
        params: {
          period: 7,
        },
      },
      {
        algorithm: 'filter_group',
        params: {
          sum_keys: 'score;sum_keys=total',
        },
      },
    ]);
  });

  test('whitelistedLinksFlow is correctly computed for links algorithm without whitelist', () => {
    const linksStore = new RankingRequestBuilder({
      apiUrl: 'http://abc.io',
      recipientAddress: '0x0A',
      asset: 'ethereum',
      algorithm: 'links',
      size: EWidgetSize.leaderboard,
      slots: 5,
      timeslot: 1,
    });

    expect(linksStore.whitelistedLinksFlow()).toEqual([
      {
        algorithm: 'links',
        params: {
          context: '0x0a',
          asset: 'ethereum',
        },
      },
      {
        algorithm: 'filter_timedecay',
        params: {
          period: 7,
        },
      },
      {
        algorithm: 'filter_group',
        params: {
          sum_keys: 'score;sum_keys=total',
        },
      },
    ]);
  });

  test('allLinksFlow is correctly computed for betweenblocks algorithm', () => {
    const linksStore = new RankingRequestBuilder({
      apiUrl: 'http://abc.io',
      recipientAddress: '0x0A',
      asset: 'ethereum',
      algorithm: 'betweenblocks;minBlockNumber=1;maxBlockNumber=2',
      size: EWidgetSize.leaderboard,
      slots: 5,
      timeslot: 1,
    });

    expect(linksStore.allLinksFlow()).toEqual([
      {
        algorithm: 'betweenblocks',
        params: {
          context: '0x0a',
          asset: 'ethereum',
          minBlockNumber: '1',
          maxBlockNumber: '2',
        },
      },
      {
        algorithm: 'filter_group',
        params: {
          sum_keys: 'score;sum_keys=total',
        },
      },
    ]);
  });

  test('whitelistedLinksFlow is correctly computed for betweenblocks algorithm', () => {
    const linksStore = new RankingRequestBuilder({
      apiUrl: 'http://abc.io',
      recipientAddress: '0x0A',
      asset: 'ethereum',
      algorithm: 'betweenblocks;minBlockNumber=1;maxBlockNumber=2',
      size: EWidgetSize.leaderboard,
      slots: 5,
      timeslot: 1,
      whitelist: '0x0A',
    });

    expect(linksStore.whitelistedLinksFlow()).toEqual([
      {
        algorithm: 'betweenblocks',
        params: {
          context: '0x0a',
          asset: 'ethereum',
          minBlockNumber: '1',
          maxBlockNumber: '2',
        },
      },
      {
        algorithm: 'filter_whitelist',
        params: {
          whitelist: '0x0a',
        },
      },
      {
        algorithm: 'filter_group',
        params: {
          sum_keys: 'score;sum_keys=total',
        },
      },
    ]);
  });

  test('whitelistedLinksFlow is correctly computed for betweenblocks algorithm without whitelist', () => {
    const linksStore = new RankingRequestBuilder({
      apiUrl: 'http://abc.io',
      recipientAddress: '0x0A',
      asset: 'ethereum',
      algorithm: 'betweenblocks;minBlockNumber=1;maxBlockNumber=2',
      size: EWidgetSize.leaderboard,
      slots: 5,
      timeslot: 1,
    });

    expect(linksStore.whitelistedLinksFlow()).toEqual([
      {
        algorithm: 'betweenblocks',
        params: {
          context: '0x0a',
          asset: 'ethereum',
          minBlockNumber: '1',
          maxBlockNumber: '2',
        },
      },
      {
        algorithm: 'filter_group',
        params: {
          sum_keys: 'score;sum_keys=total',
        },
      },
    ]);
  });
});
