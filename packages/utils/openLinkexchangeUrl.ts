import * as qs from 'qs';

const appVariantToUrl = {
  development: 'http://localhost:8010',
  production: 'https://app.linkexchange.io',
  stagging: 'https://app-test.linkexchange.io',
};

const baseUrl = appVariantToUrl[process.env.NODE_ENV!] || appVariantToUrl.production;

export const openLinkexchangeUrl = (path: string, widgetSettings) => {
  const queryString = qs.stringify({
    ...widgetSettings,
    ...(widgetSettings.linkId ? { linkId: `claim:${widgetSettings.linkId}` } : {}),
  });

  window.open(`${baseUrl}${path}?${queryString}`, '_blank');
};
