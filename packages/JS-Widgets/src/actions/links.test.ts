import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as nock from 'nock';
import fetch from 'node-fetch';

global.fetch = fetch;

import { fetchLinks } from './links';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const ERROR_MESSAGE = 'Service is currently unavailable';

describe('links actions', () => {

  it('emits error message when API is unavailable', async () => {
    nock('https://api.userfeeds.io')
      .get(/ranking.*/)
      .reply(500, ERROR_MESSAGE)
      .get(/ranking.*/)
      .reply(500, ERROR_MESSAGE);

    const store = mockStore({
      links: {},
      widget: { context: 'my-context', algorithm: 'alg-links', whitelist: 'my-whitelist' },
    });

    await store.dispatch(fetchLinks());

    expect(store.getActions().length).toBe(2);
    expect(store.getActions()[0]).toMatchObject({ type: 'links/FETCH_LINKS_STARTED', payload: undefined });
    expect(store.getActions()[1].payload.message.startsWith(ERROR_MESSAGE)).toBeTruthy();
  });

  it('emits success message (no whitelisted links)', async () => {
    const mockedData = {
      items: [{
        title: 't1',
        summary: 's1',
        target: 'http://t1',
        score: 3 * Math.pow(10, 18),
      }, {
        title: 't0',
        summary: 's0',
        target: 'http://t0',
        score: 1 * Math.pow(10, 18),
      }],
    };

    nock('https://api.userfeeds.io')
      .get(/ranking.*/)
      .query({ whitelist: 'my-whitelist' })
      .reply(200, { items: []})
      .get(/ranking.*/)
      .reply(200, mockedData);

    const store = mockStore({
      links: {},
      widget: { context: 'my-context', algorithm: 'alg-links', whitelist: 'my-whitelist' },
    });

    await store.dispatch(fetchLinks());

    const emitedActions = store.getActions();

    expect(emitedActions.length).toBe(2);
    expect(emitedActions[0]).toMatchObject({ type: 'links/FETCH_LINKS_STARTED', payload: undefined });
    expect(emitedActions[1].payload.result.allLinks).toMatchObject(mockedData.items);
    expect(emitedActions[1].payload.result.whitelistedLinks.length).toBe(0);
  });
});