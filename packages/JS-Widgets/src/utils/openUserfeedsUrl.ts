
// ToDo fix arguments type
export const openUserfeedsUrl = (
  path,
  { context, algorithm, whitelist, publisherNote, linkId }: { [key: string]: any; }) => {
  const baseUrl = 'https://userfeeds.io/';
  const contextQP = `?context=${encodeURIComponent(context)}`;
  const algorithmQP = `&algorithm=${encodeURIComponent(algorithm)}`;
  const whitelistQP = whitelist ? `&whitelist=${encodeURIComponent(whitelist)}` : '';
  const publisherNoteQP = publisherNote ? `&publisherNote=${encodeURIComponent(publisherNote)}` : '';
  const linkIdQP = linkId ? `&linkId=${encodeURIComponent(linkId)}` : '';
  window.open(baseUrl + path + contextQP + algorithmQP + whitelistQP + publisherNoteQP + linkIdQP, '_blank');
};
