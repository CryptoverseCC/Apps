
export const openUserfeedsUrl = (path, { context, algorithm, whitelist }) => {
  const baseUrl = 'https://userfeeds.io/';
  const contextQP = '?context=' + context;
  const algorithmQP = '&algorithm=' + algorithm;
  const whitelistQP = whitelist ? '&whitelist=' + whitelist : '';
  window.open(baseUrl + path + contextQP + algorithmQP + whitelistQP, '_blank');
};
