import { actionCreatorFactory, isType } from 'typescript-fsa';
import { Action } from 'redux';

const acf = actionCreatorFactory('modal');

export const modalActions = {
  open: acf<{ modalName: string, modalProps?: any }>('OPEN'),
  close: acf('CLOSE'),
};

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
