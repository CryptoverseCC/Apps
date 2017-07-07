import { Action } from 'redux';
import { isType } from 'typescript-fsa';

import { modalActions } from '../actions/modal';

export interface IModalState {
  modalName?: string;
  modalProps?: any;
}

const initialState: IModalState = {};

export default function modal(state: IModalState= initialState, action: Action): IModalState {
  if (isType(action, modalActions.open)) {
    return action.payload;
  } else if (isType(action, modalActions.close)) {
    return initialState;
  }

  return state;
}
