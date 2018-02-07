const linkexchangeUrlRegex = /linkexchange\.io/;

export const isLinkexchangeAddres = () => {
  return linkexchangeUrlRegex.test(window.location.href);
};

export const urlWithoutQueryIfLinkExchangeApp = () => {
  const { href } = window.location;
  if (linkexchangeUrlRegex.test(href) && href.indexOf('?') > 0) {
    return href.split('?')[0];
  } else {
    return href;
  }
};
