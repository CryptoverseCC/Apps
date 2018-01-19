import * as qs from 'qs';

export const openLinkexchangeUrl = (path: string, widgetSettings) => {
  const baseUrl = 'https://app.linkexchange.io/';

  const queryString = qs.stringify({
    ...widgetSettings,
    ...(widgetSettings.linkId ? { linkId: `claim:${widgetSettings.linkId}` } : {}),
  });

  window.open(`${baseUrl}${path}?${queryString}`, '_blank');
};
