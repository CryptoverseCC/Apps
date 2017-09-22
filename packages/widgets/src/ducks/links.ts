import { actionCreatorFactory, isType } from 'typescript-fsa';
import { Action } from 'redux';

import { IRootState } from './';
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
  const { widget: { context, asset, algorithm, whitelist } } = getState();
  dispatch(fetchLinksActions.started(undefined));

  const baseURL = 'https://api.userfeeds.io/ranking';
  const queryParams = whitelist ? `?whitelist=${asset}:${whitelist}` : '';
  try {
    const [{ items: whitelistedLinks = [] }, { items: allLinks = [] }]: [{ items: ILink[] }, { items: ILink[] }]  =
      await Promise.all([
        fetch(`${baseURL}/${asset}:${context}/${algorithm}/${queryParams}`)
          .then(throwErrorOnNotOkResponse)
          .then((res) => res.json()),
        fetch(`${baseURL}/${asset}:${context}/${algorithm}/`)
          .then(throwErrorOnNotOkResponse)
          .then((res) => res.json()),
      ]);

    dispatch(fetchLinksActions.done({ params: undefined, result: { whitelistedLinks, allLinks }}));
  } catch (e) {
    dispatch(fetchLinksActions.failed(e));
  }
};

export interface ILinksState {
  fetching: boolean;
  fetched: boolean;
  links: ILink[];
  allLinks: ILink[];
}

const initialState: ILinksState = {
  fetching: false,
  fetched: false,
  links: [],
  allLinks: [],
};

export default function links(state: ILinksState = initialState, action: Action): ILinksState {
  if (isType(action, fetchLinksActions.started)) {
    return { ...state, fetching: true, fetched: false };
  } else if (isType(action, fetchLinksActions.done)) {
    return {
      ...state,
      fetching: false,
      fetched: true,
      links: action.payload.result.whitelistedLinks,
      allLinks: action.payload.result.allLinks,
    };
  }

  return state;
}
