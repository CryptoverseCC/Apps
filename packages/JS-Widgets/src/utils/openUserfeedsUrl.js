
export const openUserfeedsUrl = (path, { context, algorithm, whitelist, publisherNote }) => {
  const baseUrl = 'https://userfeeds.io/';
  const contextQP = '?context=' + context;
  const algorithmQP = '&algorithm=' + algorithm;
  const whitelistQP = whitelist ? '&whitelist=' + whitelist : '';
  const publisherNoteQP = publisherNote ? '&publisherNote=' + publisherNote : '';
  window.open(baseUrl + path + contextQP + algorithmQP + whitelistQP + publisherNoteQP, '_blank');
};
