import { Action } from 'redux';
import { isType } from 'typescript-fsa';

import { web3Actions } from '../actions/web3';

export interface IWeb3State {
  available: boolean;
  unlocked: boolean;
  network?: string;
}

const initialState: IWeb3State = {
  available: false,
  unlocked: false,
};

export default function web3Reducer(state: IWeb3State = initialState, action: Action) {
  if (isType(action, web3Actions.updateAvailability)) {
    return action.payload;
  }

  return state;
}
