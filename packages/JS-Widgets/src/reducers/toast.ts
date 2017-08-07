import { Action } from 'redux';
import { isType } from 'typescript-fsa';

import { toastActions, IToast } from '../actions/toast';

export type TToastState = IToast[];

const initialState: TToastState = [];

export default function web3Reducer(state: TToastState = initialState, action: Action) {
  if (isType(action, toastActions.open)) {
    return [...state, action.payload];
  } else if (isType(action, toastActions.close)) {
    return state.filter(({ message }) => message !== action.payload);
  }

  return state;
}
