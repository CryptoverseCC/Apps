export enum EWidgetSize {
  rectangle = 'rectangle',
  leaderboard = 'leaderboard',
}

export interface IWidgetSettings {
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
  minimalLinkFee?: string;
}
