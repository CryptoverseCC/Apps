import { actionCreatorFactory, isType } from 'typescript-fsa';
import { Action } from 'redux';

export interface IBlocksState {
  startBlock: number;
  endBlock: number;
}

const initialState: IBlocksState = {
  startBlock: Number.MAX_SAFE_INTEGER,
  endBlock: Number.MAX_SAFE_INTEGER,
};

export default function blocksReducer(state: IBlocksState = initialState) {
  return state;
}
