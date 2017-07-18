import { createSelector } from 'reselect';

import { IRootState } from '../reducers';

const whitelistedLinks = ({ links }: IRootState) => links.links;
const allLinks = ({ links }: IRootState) => links.allLinks;

export const visibleLinks = createSelector(
  whitelistedLinks,
  ({ widget }: IRootState) => widget.slots,
  (links, slots) => links.slice(0, slots),
);

export const whitelistedLinksCount = createSelector(
  whitelistedLinks,
  (links) => links.length,
);

export const allLinksCount = createSelector(
  allLinks,
  (links) => links.length,
);
