import { IWidgetState } from '../ducks/widget';

type TExtendedWidgetState = IWidgetState & {
  linkId?: string;
};

// ToDo fix arguments type
export const openUserfeedsUrl = (
  path,
  { context, algorithm, whitelist, publisherNote, contactMethod, linkId, location }: TExtendedWidgetState) => {
  const baseUrl = 'https://userfeeds.io/';
  const contextQP = `?context=${encodeURIComponent(context)}`;
  const algorithmQP = `&algorithm=${encodeURIComponent(algorithm)}`;
  const whitelistQP = whitelist ? `&whitelist=${encodeURIComponent(whitelist)}` : '';
  const locationQP = location ? `&widgetLocation=${encodeURIComponent(location)}` : '';
  const publisherNoteQP = publisherNote ? `&publisherNote=${encodeURIComponent(publisherNote)}` : '';
  const contactMethodQP = contactMethod ? `&contactMethod=${encodeURIComponent(contactMethod)}` : '';
  const linkIdQP = linkId ? `&linkId=claim:${encodeURIComponent(linkId)}` : '';

  window.open(baseUrl + path + contextQP + algorithmQP + whitelistQP + publisherNoteQP + contactMethodQP
    + locationQP + linkIdQP, '_blank');
};
