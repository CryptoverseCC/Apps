import { actionCreatorFactory, isType } from 'typescript-fsa';
import { Action } from 'redux';

export interface IBentynState {
  startBlock: number;
  endBlock: number;
}

const initialState: IBentynState = {
  startBlock: Number.MAX_SAFE_INTEGER,
  endBlock: Number.MAX_SAFE_INTEGER,
};

export default function bentynReducer(state: IBentynState = initialState) {
  return state;
}
