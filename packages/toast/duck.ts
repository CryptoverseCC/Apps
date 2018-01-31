import { actionCreatorFactory, isType } from 'typescript-fsa';
import { Action } from 'redux';

const acf = actionCreatorFactory('toast');

export type TToastType = 'success' | 'failure';

export interface IToast {
  message: string;
  type: TToastType;
}

export const toastActions = {
  open: acf<IToast>('OPEN'),
  close: acf<string>('CLOSE'),
};

export const openToast = (message: string, type: TToastType = 'failure', timeout = 10000) => (dispatch) => {
  dispatch(toastActions.open({ message, type }));
  setTimeout(() => dispatch(toastActions.close(message)), timeout);
};

export type TToastState = IToast[];

const initialState: TToastState = [];

export default function toastReducer(state: TToastState = initialState, action: Action) {
  if (isType(action, toastActions.open)) {
    return [...state, action.payload];
  } else if (isType(action, toastActions.close)) {
    return state.filter(({ message }) => message !== action.payload);
  }

  return state;
}
