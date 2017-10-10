import { actionCreatorFactory, isType } from 'typescript-fsa';
import { Action } from 'redux';

import { IRootState } from './';
import { ILink, IRemoteLink } from '@userfeeds/types/link';

import { throwErrorOnNotOkResponse } from '../utils/fetch';

const acf = actionCreatorFactory('links');

export const fetchLinksActions = acf.async<
  void,
  {
    whitelistedLinks: IRemoteLink[];
    allLinks: IRemoteLink[];
  },
  { reason: any }
  >('FETCH_LINKS');

export const fetchLinks = () => async (dispatch, getState: () => IRootState) => {
  const {
    widget: { apiUrl = 'https://api.userfeeds.io', recipientAddress, asset, algorithm, whitelist },
  } = getState();

  dispatch(fetchLinksActions.started(undefined));

  const baseURL = `${apiUrl}/ranking`;
  const queryParams = whitelist ? `?whitelist=${asset}:${whitelist}` : '';
  try {
    const [{ items: whitelistedLinks = [] }, { items: allLinks = [] }] =
      await Promise.all([
        fetch(`${baseURL}/${asset}:${recipientAddress}/${algorithm}/${queryParams}`)
          .then(throwErrorOnNotOkResponse)
          .then<{ items: IRemoteLink[]; }>((res) => res.json()),
        fetch(`${baseURL}/${asset}:${recipientAddress}/${algorithm}/`)
          .then(throwErrorOnNotOkResponse)
          .then<{ items: IRemoteLink[]; }>((res) => res.json()),
      ]);

    dispatch(fetchLinksActions.done({ params: undefined, result: { whitelistedLinks, allLinks }}));
  } catch (e) {
    dispatch(fetchLinksActions.failed(e));
  }
};

export interface ILinksState {
  fetching: boolean;
  fetched: boolean;
  links: IRemoteLink[];
  allLinks: IRemoteLink[];
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
