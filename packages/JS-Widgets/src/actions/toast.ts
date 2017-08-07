import { actionCreatorFactory } from 'typescript-fsa';
import * as core from '@userfeeds/core';

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
