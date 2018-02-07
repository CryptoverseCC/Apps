export const urlWithoutQueryIfLinkExchangeApp = () => {
  const { href } = window.location;
  if (href.startsWith('https://app.linkexchange.io/') && href.indexOf('?') > 0) {
    return href.split('?')[0];
  } else {
    return href;
  }
};
