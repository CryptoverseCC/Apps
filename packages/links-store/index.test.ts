import LinksStore from './';
import { EWidgetSize } from '@linkexchange/types/widget';
import { reaction, toJS } from 'mobx';

const expectComputedPromiseValueToEqual = (observable, property, expected) => {
  return new Promise((resolve) => {
    reaction(
      () => observable[property],
      (value, reaction) => {
        expect(value).toEqual(expected);
        reaction.dispose();
        resolve();
      },
    );
  });
};

class RankingRequestBuilderMock {
  allLinksFetch = jest.fn().mockReturnValue(Promise.resolve({ items: [{}] }));
  whitelistedLinksFetch = jest.fn().mockReturnValue(Promise.resolve({ items: [] }));
}

describe('LinksStore', () => {
  test('allLinks is empty by default', async () => {
    const linksStore = new LinksStore(
      {
        apiUrl: 'http://abc.io',
        recipientAddress: '0x0A',
        asset: 'ethereum',
        algorithm: 'betweenblocks;minBlockNumber=1;maxBlockNumber=2',
        size: EWidgetSize.leaderboard,
        slots: 5,
        timeslot: 1,
      },
      RankingRequestBuilderMock,
    );
    expect(toJS(linksStore.allLinks)).toEqual([]);
  });

  test('allLinks updates to items when promise resolves', async () => {
    const linksStore = new LinksStore(
      {
        apiUrl: 'http://abc.io',
        recipientAddress: '0x0A',
        asset: 'ethereum',
        algorithm: 'betweenblocks;minBlockNumber=1;maxBlockNumber=2',
        size: EWidgetSize.leaderboard,
        slots: 5,
        timeslot: 1,
      },
      RankingRequestBuilderMock,
    );
    await expectComputedPromiseValueToEqual(linksStore, 'allLinks', [{}]);
  });

  test('allLinks updates to undefined when promise rejects', async () => {
    class RankingRequestBuilderMock {
      allLinksFetch = jest.fn(() => Promise.reject({}));
      whitelistedLinksFetch = jest.fn(() => Promise.reject({}));
    }

    const linksStore = new LinksStore(
      {
        apiUrl: 'http://abc.io',
        recipientAddress: '0x0A',
        asset: 'ethereum',
        algorithm: 'betweenblocks;minBlockNumber=1;maxBlockNumber=2',
        size: EWidgetSize.leaderboard,
        slots: 5,
        timeslot: 1,
      },
      RankingRequestBuilderMock,
    );
    await expectComputedPromiseValueToEqual(linksStore, 'allLinks', []);
  });
});
