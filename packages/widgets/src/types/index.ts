
export type TWidgetSize = 'rectangle' | 'leaderboard';

export interface ILink {
  id: string;
  title: string;
  summary: string;
  score: number;
  target: string;
  probability: number;
  group_count: number;
}
