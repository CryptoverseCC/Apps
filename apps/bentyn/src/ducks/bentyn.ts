import { actionCreatorFactory, isType } from 'typescript-fsa';
import { Action } from 'redux';

export interface IBentynState {
  startBlock: number;
  endBlock: number;
}

const initialState: IBentynState = {};

export default function bentynReducer(state: IBentynState = initialState) {
  return state;
}
