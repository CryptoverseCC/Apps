import { IWidgetState } from '../ducks/widget';
import * as qs from 'qs';

type TExtendedWidgetState = IWidgetState & {
  linkId?: string;
};

export const openLinkexchangeUrl = (path: string, widgetSettings: TExtendedWidgetState) => {
  const baseUrl = 'https://linkexchange.io/';

  const queryString = qs.stringify({
    ...widgetSettings,
    ...(widgetSettings.linkId ? { linkId: `claim:${widgetSettings.linkId}` } : {}),
  });

  window.open(`${baseUrl}${path}?${queryString}`, '_blank');
};
