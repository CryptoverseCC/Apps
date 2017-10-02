import { IWidgetState } from '../ducks/widget';
import * as qs from 'qs';

type TExtendedWidgetState = IWidgetState & {
  linkId?: string;
};

// ToDo fix arguments type
export const openUserfeedsUrl = (path, widgetSettings: TExtendedWidgetState) => {
  const baseUrl = 'https://userfeeds.io/';

  const queryString = qs.stringify({
    ...widgetSettings,
    ...(widgetSettings.linkId ? { linkId: `claim:${widgetSettings.linkId}` } : {}),
  });

  window.open(`${baseUrl}${path}?${queryString}`, '_blank');
};
