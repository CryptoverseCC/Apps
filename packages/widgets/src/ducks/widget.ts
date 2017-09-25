import { actionCreatorFactory, isType } from 'typescript-fsa';
import { Action } from 'redux';

import { TWidgetSize } from '../types';
import { IRootState } from './';

import { fetchLinks } from './links';

const acf = actionCreatorFactory('widget');

export const widgetActions = {
  update: acf<IWidgetState>('UPDATE'),
};

export const updateWidgetSettings = (newSettings: IWidgetState) => (dispatch, getState: () => IRootState) => {
  const { widget: oldSettings } = getState();
  dispatch(widgetActions.update(newSettings));

  if (newSettings.recipientAddress !== oldSettings.recipientAddress
    || newSettings.asset !== oldSettings.asset
    || newSettings.whitelist !== oldSettings.whitelist
    || newSettings.algorithm !== oldSettings.algorithm) {
    dispatch(fetchLinks());
  }
};

export interface IWidgetState {
  recipientAddress: string;
  asset: string;
  algorithm: string;
  size: TWidgetSize;
  whitelist?: string;
  slots: number;
  timeslot: number;
  contactMethod?: string;
  publisherNote?: string;
  title: string;
  description: string;
  impression: string;
  location: string;
  tillDate: string;
}

const initialState = {};

export default function widget(state: IWidgetState = initialState, action: Action): IWidgetState {
  if (isType(action, widgetActions.update)) {
    return action.payload;
  }

  return state;
}
