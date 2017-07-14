import { Action } from 'redux';
import { isType } from 'typescript-fsa';

import { ILink } from '../types';
import { fetchLinksActions } from '../actions/links';

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
