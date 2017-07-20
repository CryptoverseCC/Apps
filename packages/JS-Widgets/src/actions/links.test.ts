import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as nock from 'nock';
import fetch from 'node-fetch';

global.fetch = fetch;

import { fetchLinks } from './links';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const ERROR_MESSAGE = 'Service is currently unavailable';

const userfeedsApi = nock('https://api.userfeeds.io')
  .persist()
  .get(/ranking.*/)
  .reply(500, ERROR_MESSAGE);

describe('links actions', () => {

  it('emits error message when API is unavailable ', async () => {
    const store = mockStore({
      links: {},
      widget: { context: 'my-context', algorithm: 'alg-links', whitelist: 'my-whitelist' },
    });

    await store.dispatch(fetchLinks());
    expect(store.getActions().length).toBe(2);
    expect(store.getActions()[0]).toMatchObject({ type: 'links/FETCH_LINKS_STARTED', payload: undefined });
    expect(store.getActions()[1].payload.message.startsWith(ERROR_MESSAGE)).toBeTruthy();
  });
});
