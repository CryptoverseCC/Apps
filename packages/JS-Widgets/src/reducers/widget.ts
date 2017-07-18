import { TWidgetSize } from '../types';

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
}

const initialState = {};

export default function widget(state: IWidgetState = initialState): IWidgetState {
  return state;
}
