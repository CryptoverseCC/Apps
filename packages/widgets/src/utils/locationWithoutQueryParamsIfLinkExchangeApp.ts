
export const locationWithoutQueryParamsIfLinkExchangeApp = () => {
  const { href } = window.location;
  if (href.startsWith('https://linkexchange.io/apps/') && href.indexOf('?') > 0) {
    return href.split('?')[0];
  } else {
    return href;
  }
};
