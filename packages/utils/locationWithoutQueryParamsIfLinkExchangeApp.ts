export const locationWithoutQueryParamsIfLinkExchangeApp = () => {
  const { href } = window.location;
  if (href.startsWith('https://apps.linkexchange.io/') && href.indexOf('?') > 0) {
    return href.split('?')[0];
  } else {
    return href;
  }
};
