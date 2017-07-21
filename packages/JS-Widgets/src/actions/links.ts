import { actionCreatorFactory } from 'typescript-fsa';

import { IRootState } from '../reducers';
import { ILink } from '../types';

import { throwErrorOnNotOkResponse } from '../utils/fetch';

const acf = actionCreatorFactory('links');

export const fetchLinksActions = acf.async<
  void,
  {
    whitelistedLinks: ILink[];
    allLinks: ILink[];
  },
  { reason: any }
  >('FETCH_LINKS');

export const fetchLinks = () => async (dispatch, getState: () => IRootState) => {
  const { widget: { context, algorithm, whitelist } } = getState();
  dispatch(fetchLinksActions.started(undefined));

  const baseURL = 'https://api.userfeeds.io/ranking';
  const queryParams = whitelist ? `?whitelist=${whitelist}` : '';
  try {
    const [{ items: whitelistedLinks = [] }, { items: allLinks = [] }]: [{ items: ILink[] }, { items: ILink[] }]  =
      await Promise.all([
        fetch(`${baseURL}/${context}/${algorithm}/${queryParams}`)
          .then(throwErrorOnNotOkResponse)
          .then((res) => res.json()),
        fetch(`${baseURL}/${context}/${algorithm}/`)
          .then(throwErrorOnNotOkResponse)
          .then((res) => res.json()),
      ]);

    dispatch(fetchLinksActions.done({ params: undefined, result: { whitelistedLinks, allLinks }}));
  } catch (e) {
    dispatch(fetchLinksActions.failed(e));
  }
};
