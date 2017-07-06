
type rectangle = 'rectangle';
type leaderboard = 'leaderboard';

export interface IWidgetState {
  context: string;
  algorithm: string;
  size?: rectangle | leaderboard;
  whitelist?: string;
  timeslot?: number;
  publisherNote?: string;
}

const initialState = {};

export default function widget(state: IWidgetState = initialState): IWidgetState {
  return state;
}