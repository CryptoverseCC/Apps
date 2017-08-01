import { Action } from 'redux';
import { isType } from 'typescript-fsa';

import { TWidgetSize } from '../types';
import { widgetActions } from '../actions/widget';

type rectangle = 'rectangle';
type leaderboard = 'leaderboard';

export interface IWidgetState {
  context: string;
  algorithm: string;
  size: TWidgetSize;
  whitelist?: string;
  slots: number;
  timeslot: number;
  publisherNote?: string;
  title: string;
  description: string;
  impression: string;
}

const initialState = {};

export default function widget(state: IWidgetState = initialState, action: Action): IWidgetState {
  if (isType(action, widgetActions.update)) {
    return action.payload;
  }

  return state;
}
