import { actionCreatorFactory, isType } from 'typescript-fsa';
import { Action } from 'redux';

import { EWidgetSize } from '@userfeeds/types/widget';
// import { IRootState } from './';

// import { fetchLinks } from './links';

const acf = actionCreatorFactory('widget');

export const widgetActions = {
  update: acf<Partial<IWidgetState>>('UPDATE'),
};

export const updateWidgetSettings =
  (newSettings: Partial<IWidgetState>, onChange: () => void) => (dispatch, getState: () => IRootState) => {
  const { widget: oldSettings } = getState();
  dispatch(widgetActions.update(newSettings));

  if (newSettings.recipientAddress !== oldSettings.recipientAddress
    || newSettings.asset !== oldSettings.asset
    || newSettings.whitelist !== oldSettings.whitelist
    || newSettings.algorithm !== oldSettings.algorithm) {
    dispatch(onChange());
  }
};

export interface IWidgetState {
  apiUrl: string;
  recipientAddress: string;
  asset: string;
  algorithm: string;
  size: EWidgetSize;
  whitelist?: string;
  slots: number;
  timeslot: number;
  contactMethod?: string;
  title?: string;
  description?: string;
  impression?: string;
  location?: string;
  tillDate?: string;
}

export const initialState = {
  apiUrl: 'https://api.userfeeds.io',
  recipientAddress: '0x0',
  asset: 'rinkeby',
  algorithm: 'links',
  size: EWidgetSize.rectangle,
  slots: 10,
  timeslot: 5,
};

export default function widget(state: IWidgetState = initialState, action: Action): IWidgetState {
  if (isType(action, widgetActions.update)) {
    return { ...state, ...action.payload };
  }

  return state;
}
